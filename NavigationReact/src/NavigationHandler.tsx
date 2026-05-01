'use client'
import React, { useCallback, useContext, useDeferredValue, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { StateNavigator, StateContext, State } from 'navigation';
import NavigationContext from './NavigationContext.js';
import RefetchContext from './RefetchContext.js';
import HistoryCacheContext from './HistoryCacheContext.js';
import NavigationDeferredContext from './NavigationDeferredContext.js';
import BundlerContext from './BundlerContext.js';
type NavigationHandlerState = { ignoreCache?: boolean | string, rscCache?: any, oldState: State, state: State, data: any, asyncData: any, stateNavigator: StateNavigator };

const NavigationHandler = ({stateNavigator, children}: {stateNavigator: StateNavigator, children: any}) => {
    const [navigationEvent, setNavigationEvent] = useState<{data: NavigationHandlerState, stateNavigator: StateNavigator, intercept?: {resume: () => void, resolve?: () => {}, signal?: AbortSignal}}>();
    const navigationDeferredEvent = useDeferredValue?.(navigationEvent) || navigationEvent;
    const [isPending, startTransition] = useTransition?.() || [false];
    const historyCacheRef = useRef({});
    const rootViews = useRef({});
    const {encodeBody, fetchRSC, onHmrReload} = useContext(BundlerContext) as any;
    const bundler = useMemo(() => ({
        deserialize: async (sceneViewKey: string, _options: any, actionId: string = null, args: any[] = null) => {
            const currentStateContext = navigationEvent.stateNavigator.stateContext;
            const {stateContext: {url, nextCrumb, historyAction}, historyManager} = navigationEvent.data.stateNavigator;
            const responsePromise = (async () => {
                let response = null;
                try {
                    response = await fetch(historyManager.getHref(nextCrumb.crumblessUrl), {
                        method: 'post',
                        headers: !actionId ? {'Content-Type': 'application/json'} : undefined,
                        body: await encodeBody({url, sceneViewKey, historyAction, rootViews: rootViews.current, actionId, args})
                    });
                } catch(e) {
                    if (!navigationEvent.intercept?.signal?.aborted) throw e;
                    else return new Promise(() => {});
                }
                const reader = response.body.getReader();
                const customStream = new ReadableStream({
                    async pull(controller) {
                        try {
                            const {done, value} = await reader.read();
                            if (!done) controller.enqueue(value);
                            else controller.close();
                        } catch(e) {
                            if (!navigationEvent.intercept?.signal?.aborted) controller.error(e);
                        }
                    }
                });
                return new Response(customStream, {headers: response.headers});
            })();
            const res = await fetchRSC(responsePromise);
            if (navigationEvent.stateNavigator.stateContext !== currentStateContext)
                return !actionId ? new Promise(() => {}) : res.data;
            if (res.url) {
                navigationEvent.data.stateNavigator.stateContext['rscCache'] = res.sceneViews;
                navigationEvent.data.stateNavigator.navigateLink(res.url, res.historyAction, false, undefined, stateNavigator.stateContext);
            } else if (actionId && res.refetch) {
                startTransition(() => {
                    setNavigationEvent({data: {...navigationEvent.data, ignoreCache: res.refetch, rscCache: res.sceneViews}, stateNavigator: navigationEvent.stateNavigator});
                });
            }
            return !actionId ? !res.url ? res.sceneViews[sceneViewKey] : new Promise(() => {}) : res.data;
        },
        onHmrReload,
    }), [encodeBody, fetchRSC, onHmrReload, navigationEvent])
    const raiseNavigationEvent = useCallback((stateContext: StateContext = stateNavigator.stateContext, resumeNavigation?: () => void, rscCache?: any) => {
        class AsyncStateNavigator extends StateNavigator {
            constructor() {
                super(stateNavigator, stateNavigator.historyManager);
                this.stateContext = stateContext;
                this.configure = stateNavigator.configure.bind(stateNavigator);
                this.onBeforeNavigate = stateNavigator.onBeforeNavigate.bind(stateNavigator);
                this.offBeforeNavigate = stateNavigator.offBeforeNavigate.bind(stateNavigator);
                this.onNavigate = stateNavigator.onNavigate.bind(stateNavigator);
                this.offNavigate = stateNavigator.offNavigate.bind(stateNavigator);
            }
            navigateLink(url: string, historyAction: 'add' | 'replace' | 'none' = 'add', history = false,
                suspendNavigation?: (stateContext: StateContext, resumeNavigation: () => void) => void,
                currentContext = this.stateContext) {
                if (!suspendNavigation)
                    suspendNavigation = (_stateContext, resumeNavigation) => resumeNavigation();
                stateNavigator.navigateLink(url, historyAction, history, (stateContext, resumeNavigation) => {
                    suspendNavigation(stateContext, () => {
                        const {oldState, state, history, crumbs} = stateContext;
                        const refresh = oldState === state && crumbs.length === this.stateContext.crumbs.length;
                        const startTran = (!history && !refresh && startTransition) || ((transition) => transition());
                        startTran(() => {
                            raiseNavigationEvent(stateContext, resumeNavigation, this.stateContext['rscCache']);
                        });
                    })
                }, currentContext);
            }
        }
        const asyncNavigator = new AsyncStateNavigator()
        const {url, oldUrl, oldState, state, data, asyncData, historyAction, history, crumbs} = asyncNavigator.stateContext;
        const refresh = oldUrl && oldState === state && crumbs.length === asyncNavigator.parseLink(oldUrl).crumbs.length;
        const intercept = {resume: resumeNavigation, resolve: null, signal: null};
        setNavigationEvent({data: {oldState, state, data, asyncData, stateNavigator: asyncNavigator, rscCache, ignoreCache: !!rscCache}, stateNavigator, intercept});
        if (typeof window !== 'undefined' && historyAction !== 'none' && !history) {
            navigation.addEventListener('navigate', e => {
                e.intercept({
                    focusReset: refresh ? 'manual' : 'after-transition',
                    async precommitHandler() {
                        return new Promise(resolve => {
                            intercept.resolve = resolve;
                            intercept.signal = e.signal;
                        });
                    }
                });
            }, {once: true});
            stateNavigator.historyManager.addHistory(url, historyAction === 'replace', null);
        }
    }, [stateNavigator]);
    if (!navigationEvent) raiseNavigationEvent();
    const refetchControl = useMemo(() => ({
        sceneViewKey: null,
        refetcher: (sceneViewKey: string | boolean = true) => {
            startTransition(() => {
                setNavigationEvent({data: {...navigationEvent.data, ignoreCache: sceneViewKey, rscCache: undefined}, stateNavigator: navigationEvent.stateNavigator});
            });
        },
        registerSceneView: (sceneViewKey: string, active: string | string[]) => {
            rootViews.current[sceneViewKey] = active;
        },
    }), [navigationEvent]);
    useEffect(() => {
        const onNavigate = () => {
            if (navigationEvent.data.stateNavigator.stateContext !== stateNavigator.stateContext)
                raiseNavigationEvent();
        };
        stateNavigator.onNavigate(onNavigate);
        return () => stateNavigator.offNavigate(onNavigate);
    }, [stateNavigator, navigationEvent, raiseNavigationEvent]);
    const oldSceneCount = (typeof window !== 'undefined' && window.history?.state?.sceneCount) || 0;
    useEffect(() => {
        if (!isPending && navigationEvent === navigationDeferredEvent) {
            const {stateContext: {url, historyAction, history}} = navigationEvent.stateNavigator;
            const resume = () => {
                navigationEvent.intercept?.resume?.();
                if (historyAction === 'none' || typeof window === 'undefined' || !window.history) return;
                const historyCache = historyCacheRef.current;
                const sceneCount = window.history.state?.sceneCount || (oldSceneCount + 1);
                if (!historyCache[url]) historyCache[url] = {};
                historyCache[url].count = Math.min(historyCache[url].count || sceneCount, sceneCount);
                const historyUrls = Object.keys(historyCache);
                for(let i = 0; i < historyUrls.length && !history; i++) {
                    const historyUrl = historyUrls[i];
                    const gap = historyCache[historyUrl].count - sceneCount;
                    if (historyUrl !== url && (gap === 0 || (historyAction === 'add' && gap > 0)))
                        delete historyCache[historyUrl];
                }
                window.history.replaceState({...window.history.state, sceneCount}, null);
            }
            navigation.addEventListener('navigatesuccess', resume, {once: true});
            const resolve = navigationEvent.intercept?.resolve;
            if (resolve) resolve();
            else resume();
        }
    }, [isPending, navigationEvent, navigationDeferredEvent]);
    useEffect(() => {
        if (stateNavigator !== navigationEvent.stateNavigator)
            raiseNavigationEvent(undefined, undefined, {});
    }, [navigationEvent, stateNavigator]);
    useEffect(() => {
        const offHmrReload = onHmrReload(() => {
            startTransition(() => {
                setNavigationEvent({data: {...navigationEvent.data, ignoreCache: true, rscCache: undefined}, stateNavigator: navigationEvent.stateNavigator});
            });
        });
        return offHmrReload;
    }, [navigationEvent, onHmrReload]);
    return (
        <NavigationContext.Provider value={navigationEvent?.data}>
            <NavigationDeferredContext.Provider value={navigationDeferredEvent?.data}>
                <RefetchContext.Provider value={refetchControl}>
                    <HistoryCacheContext.Provider value={historyCacheRef.current}>
                        <BundlerContext.Provider value={bundler}>
                            {children}
                        </BundlerContext.Provider>
                    </HistoryCacheContext.Provider>
                </RefetchContext.Provider>
            </NavigationDeferredContext.Provider>
        </NavigationContext.Provider>
    )
}
export default NavigationHandler;
