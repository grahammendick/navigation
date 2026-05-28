'use client'
import React, { useCallback, useContext, useDeferredValue, useEffect, useInsertionEffect, useMemo, useRef, useState, useTransition } from 'react';
import { StateNavigator, StateContext, State } from 'navigation';
import NavigationContext from './NavigationContext.js';
import RefetchContext from './RefetchContext.js';
import HistoryCacheContext from './HistoryCacheContext.js';
import NavigationDeferredContext from './NavigationDeferredContext.js';
import BundlerContext from './BundlerContext.js';
type Intercept = {resume?: () => void, commit?: () => void, signal?: AbortSignal, title?: string, controller?: NavigationPrecommitController, hasUAVisualTransition?: boolean};
type NavigationHandlerState = { ignoreCache?: boolean | string, rscCache?: any, hasUAVisualTransition?: boolean, oldState: State, state: State, data: any, asyncData: any, stateNavigator: StateNavigator & { navigateLink: (...args: [...Parameters<StateNavigator['navigateLink']>, Intercept?]) => void } };

const NavigationHandler = ({stateNavigator, children}: {stateNavigator: StateNavigator, children: any}) => {
    const [navigationEvent, setNavigationEvent] = useState<{data: NavigationHandlerState, stateNavigator: StateNavigator, intercept?: Intercept}>();
    const navigationDeferredEvent = useDeferredValue?.(navigationEvent) || navigationEvent;
    const [isPending, startTransition] = useTransition?.() || [false];
    const historyCacheRef = useRef({});
    const rootViews = useRef({});
    const {createTemporaryReferenceSet, encodeReply, createFromFetch, onHmrReload} = useContext(BundlerContext);
    const raiseNavigationEvent = useCallback((stateContext: StateContext = stateNavigator.stateContext, intercept: Intercept = {}, rscCache?: any) => {
        class AsyncStateNavigator extends StateNavigator {
            constructor() {
                super(stateNavigator, stateNavigator.historyManager);
                stateNavigator.historyManager.stop();
                this.stateContext = stateContext;
                this.configure = stateNavigator.configure.bind(stateNavigator);
                this.onBeforeNavigate = stateNavigator.onBeforeNavigate.bind(stateNavigator);
                this.offBeforeNavigate = stateNavigator.offBeforeNavigate.bind(stateNavigator);
                this.onNavigate = stateNavigator.onNavigate.bind(stateNavigator);
                this.offNavigate = stateNavigator.offNavigate.bind(stateNavigator);
            }
            navigateLink(url: string, historyAction: 'add' | 'replace' | 'none' = 'add', history = false,
                suspendNavigation?: (stateContext: StateContext, resumeNavigation: () => void) => void,
                currentContext = this.stateContext, intercept: Intercept = {}) {
                if (!suspendNavigation)
                    suspendNavigation = (_stateContext, resumeNavigation) => resumeNavigation();
                let navigating = false;
                stateNavigator.navigateLink(url, historyAction, history, (stateContext, resumeNavigation) => {
                    suspendNavigation(stateContext, () => {
                        navigating = true;
                        const {oldState, state, crumbs} = stateContext;
                        const refresh = oldState === state && crumbs.length === this.stateContext.crumbs.length;
                        const startTran = (!refresh && startTransition) || ((transition) => transition());
                        intercept.title = typeof document !== 'undefined' ? document.title : null;
                        intercept.resume = resumeNavigation;
                        startTran(() => {
                            raiseNavigationEvent(stateContext, intercept, this.stateContext['rscCache']);
                        });
                    })
                }, currentContext);
                if (!navigating) intercept?.commit?.();
            }
        }
        const asyncNavigator = new AsyncStateNavigator()
        const {url, oldState, state, data, asyncData, historyAction, history} = asyncNavigator.stateContext;
        setNavigationEvent({data: {oldState, state, data, asyncData, stateNavigator: asyncNavigator, rscCache, ignoreCache: !!rscCache, hasUAVisualTransition: intercept.hasUAVisualTransition}, stateNavigator, intercept});
        if (typeof window !== 'undefined' && historyAction !== 'none' && !history && (!intercept.commit || intercept.controller)) {
            let historyAdded = false;
            const onNavigate = (e: NavigateEvent) => {
                historyAdded = true;
                e.intercept({
                    focusReset: 'manual',
                    scroll: 'manual',
                    async precommitHandler(controller) {
                        return new Promise((resolve, reject) => {
                            intercept.commit = resolve;
                            intercept.signal = e.signal;
                            intercept.controller = controller;
                            e.signal.addEventListener('abort', () => reject(e.signal.reason));
                        });
                    }
                });
            };
            navigation.addEventListener('navigate', onNavigate, {once: true});
            stateNavigator.historyManager.navigate(url, historyAction === 'replace', intercept.controller);
            if (!historyAdded) navigation.removeEventListener('navigate', onNavigate);
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
        deserialize: async (sceneViewKey: string, _options: any, actionId: string = null, args: any[] = null) => {
            const currentStateContext = navigationEvent.stateNavigator.stateContext;
            const {stateContext: {url, nextCrumb, historyAction, history}, historyManager} = navigationEvent.data.stateNavigator;
            const responsePromise = (async () => {
                let response = null;
                try {
                    const temporaryReferences = createTemporaryReferenceSet();
                    response = await fetch(historyManager.getHref(nextCrumb.crumblessUrl), {
                        method: 'post',
                        headers: !actionId ? {'Content-Type': 'application/json'} : {},
                        body: await encodeReply({url, sceneViewKey, historyAction, history, rootViews: rootViews.current, actionId, args}, {temporaryReferences}),
                        signal: navigationEvent.intercept?.signal
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
            })() as any;
            const res = await createFromFetch(responsePromise);
            if (navigationEvent.stateNavigator.stateContext !== currentStateContext)
                return !actionId ? new Promise(() => {}) : res.data;
            if (res.url) {
                navigationEvent.data.stateNavigator.stateContext['rscCache'] = res.sceneViews;
                navigationEvent.data.stateNavigator.navigateLink(res.url, res.historyAction, false, undefined, stateNavigator.stateContext, navigationEvent.intercept);
            } else if (actionId && res.refetch) {
                startTransition(() => {
                    setNavigationEvent({data: {...navigationEvent.data, ignoreCache: res.refetch, rscCache: res.sceneViews}, stateNavigator: navigationEvent.stateNavigator});
                });
            }
            return !actionId ? !res.url ? res.sceneViews[sceneViewKey] : new Promise(() => {}) : res.data;
        },
    }), [navigationEvent, createTemporaryReferenceSet, encodeReply, createFromFetch]);
    useEffect(() => {
        const onNavigate = () => {
            if (navigationEvent.data.stateNavigator.stateContext !== stateNavigator.stateContext)
                raiseNavigationEvent();
        };
        stateNavigator.onNavigate(onNavigate);
        return () => stateNavigator.offNavigate(onNavigate);
    }, [stateNavigator, navigationEvent, raiseNavigationEvent]);
    const oldSceneCount = (typeof window !== 'undefined' && (window.navigation?.currentEntry.getState()?.sceneCount || window.history?.state?.sceneCount)) || 0;
    useInsertionEffect(() => {
        const commit = navigationEvent.intercept?.commit;
        if (!isPending && navigationEvent === navigationDeferredEvent && commit) commit();
        const title = typeof document !== 'undefined' ? document.title : null;
        const oldTitle = navigationEvent.intercept?.title;
        if (typeof document !== 'undefined' && oldTitle) document.title = oldTitle;
        if (navigationEvent.intercept) navigationEvent.intercept.title = title;
    }, [isPending, navigationEvent, navigationDeferredEvent]);
    useEffect(() => {
        if (!isPending && navigationEvent === navigationDeferredEvent) {
            const {stateContext: {url, historyAction, history}} = navigationEvent.data.stateNavigator;
            navigationEvent.intercept?.resume?.();
            const newTitle = navigationEvent.intercept?.title;
            if (typeof document !== 'undefined' && newTitle) document.title = newTitle;
            navigationEvent.intercept = {};
            if (historyAction === 'none' || typeof window === 'undefined' || !window.history) return;
            const historyCache = historyCacheRef.current;
            const sceneCount = (window.navigation?.currentEntry.getState()?.sceneCount || window.history?.state?.sceneCount) || (oldSceneCount + 1);
            if (!historyCache[url]) historyCache[url] = {};
            historyCache[url].count = Math.min(historyCache[url].count || sceneCount, sceneCount);
            const historyUrls = Object.keys(historyCache);
            for(let i = 0; i < historyUrls.length && !history; i++) {
                const historyUrl = historyUrls[i];
                const gap = historyCache[historyUrl].count - sceneCount;
                if (historyUrl !== url && (gap === 0 || (historyAction === 'add' && gap > 0)))
                    delete historyCache[historyUrl];
            }
            if (window.navigation) window.navigation.updateCurrentEntry({state: {...window.navigation.currentEntry.getState(), sceneCount}});
            else window.history.replaceState({...window.history.state, sceneCount}, null);
        }
    }, [isPending, navigationEvent, navigationDeferredEvent]);
    useEffect(() => {
        const onNavigate = (e: NavigateEvent) => {
            if (e.navigationType !== 'traverse' && e.canIntercept) return;
            e.intercept({
                focusReset: 'manual',
                scroll: 'manual',
                async precommitHandler() {
                    return new Promise((resolve, reject) => {
                        const url = navigationEvent.stateNavigator.historyManager.getCurrentUrl(e.destination);
                        const intercept = {commit: resolve, signal:  e.signal, hasUAVisualTransition: e.hasUAVisualTransition};
                        navigationEvent.data.stateNavigator.navigateLink(url, undefined, true, undefined, undefined, intercept);
                        e.signal.addEventListener('abort', () => reject(e.signal.reason));
                    });
                }
            });
        };
        navigation.addEventListener('navigate', onNavigate);
        return () => navigation.removeEventListener('navigate', onNavigate);
    }, [navigationEvent])
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
                        {children}
                    </HistoryCacheContext.Provider>
                </RefetchContext.Provider>
            </NavigationDeferredContext.Provider>
        </NavigationContext.Provider>
    )
}
export default NavigationHandler;
