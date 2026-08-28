'use client'
import React, { useCallback, useContext, useOptimistic, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { StateNavigator, StateContext, State } from 'navigation';
import NavigationContext from './NavigationContext.js';
import RefetchContext from './RefetchContext.js';
import HistoryCacheContext from './HistoryCacheContext.js';
import TransitionContext from './TransitionContext.js';
import BundlerContext from './BundlerContext.js';
type Intercept = {resume?: () => void, commit?: () => void, signal?: AbortSignal, title?: string, controller?: NavigationPrecommitController, hasUAVisualTransition?: boolean};
type NavigationHandlerState = { ignoreCache?: boolean | string, rscCache?: any, hasUAVisualTransition?: boolean, oldState: State, state: State, data: any, asyncData: any, stateNavigator: StateNavigator & { navigateLink: (...args: [...Parameters<StateNavigator['navigateLink']>, Intercept?]) => void } };

const supportsPrecommitNavigation = typeof window !== 'undefined' && !!window.NavigationPrecommitController
    && !!(window.navigator as any).userAgentData?.brands?.some(({brand}) => brand === 'Microsoft Edge' || brand === 'Google Chrome' || brand === 'Opera' || brand === 'Opera GX');

const NavigationHandler = ({stateNavigator, children}: {stateNavigator: StateNavigator, children: any}) => {
    const [navigationEvent, setNavigationEvent] = useState<{data: NavigationHandlerState, stateNavigator: StateNavigator, intercept?: Intercept}>();
    const [nextNavigationEvent, setNextNavigationEvent] = useOptimistic?.(navigationEvent);
    const [isPending, startTransition] = useTransition?.() || [false];
    const [, setTransitionAborted] = useState({});
    const transitionAborted = nextNavigationEvent?.intercept?.signal?.aborted;
    const navigationTransition = useMemo(() => ({navigationEvent: navigationEvent?.data, nextNavigationEvent: !transitionAborted ? nextNavigationEvent?.data : navigationEvent?.data}), [navigationEvent, nextNavigationEvent, transitionAborted]);
    const historyCacheRef = useRef({});
    const historyCache = useMemo(() => ({
        instance: historyCacheRef,
        supportsPrecommitNavigation,
        get: ({hasUAVisualTransition, stateNavigator: {stateContext: {url, history}}}: NavigationHandlerState, sceneViewKey: string) => {
            return (history && (!supportsPrecommitNavigation || !!hasUAVisualTransition)) ? historyCacheRef.current[url]?.[sceneViewKey] : null;
        },
        set: ({stateNavigator: {stateContext: {url}}}: NavigationHandlerState, sceneViewKey: string, sceneView: any) => {
            if (!historyCacheRef.current[url]) historyCacheRef.current[url] = {};
            historyCacheRef.current[url][sceneViewKey] = sceneView;
        }
    }), []);
    const rootViews = useRef({});
    const {createTemporaryReferenceSet, encodeReply, createFromFetch, onHmrReload} = useContext(BundlerContext);
    const raiseNavigationEvent = useCallback((stateContext: StateContext = stateNavigator.stateContext, intercept: Intercept = {}, rscCache?: any) => {
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
                currentContext = this.stateContext, intercept: Intercept = {}) {
                if (!suspendNavigation)
                    suspendNavigation = (_stateContext, resumeNavigation) => resumeNavigation();
                let navigating = false;
                stateNavigator.navigateLink(url, historyAction, history, (stateContext, resumeNavigation) => {
                    suspendNavigation(stateContext, () => {
                        navigating = true;
                        const startTran = startTransition || ((transition) => transition());
                        intercept.title = typeof document !== 'undefined' && createFromFetch ? document.title : null;
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
        const nextNavigationEvent = {data: {oldState, state, data, asyncData, stateNavigator: asyncNavigator, rscCache, ignoreCache: !!rscCache, hasUAVisualTransition: intercept.hasUAVisualTransition}, stateNavigator, intercept};
        setNavigationEvent(nextNavigationEvent);
        if (intercept.resume) setNextNavigationEvent(nextNavigationEvent);
        if (typeof window !== 'undefined' && intercept.resume && supportsPrecommitNavigation && createFromFetch && historyAction !== 'none' && !history && (!intercept.commit || intercept.controller)) {
            if (!intercept.controller) {
                window.navigation.addEventListener('navigate', e => {
                    if (e.info?.stateContext !== asyncNavigator.stateContext) return;
                    e.intercept({
                        focusReset: 'manual',
                        scroll: 'manual',
                        async precommitHandler(controller) {
                            return new Promise((resolve, reject) => {
                                intercept.commit = resolve;
                                intercept.signal = e.signal;
                                if (e.navigationType !== 'traverse') intercept.controller = controller;
                                e.signal.addEventListener('abort', () => {
                                    reject(e.signal.reason)
                                    setTransitionAborted({});
                                });
                            });
                        }
                    });
                }, {once: true});
            }
            const res = stateNavigator.historyManager.navigate(url, historyAction === 'replace', intercept.controller, asyncNavigator.stateContext);
            res?.committed.catch((e) => {
                if (!intercept?.signal?.aborted) throw e;
            });
        }
    }, [stateNavigator, createFromFetch]);
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
        deserialize: async (sceneViewKey: string, actionId: string = null, args: any[] = null) => {
            const currentStateContext = navigationEvent.stateNavigator.stateContext;
            const {stateContext: nextStateContext, historyManager} = navigationEvent.data.stateNavigator
            const {url, nextCrumb} = nextStateContext;
            const responsePromise = (async () => {
                let response = null;
                try {
                    const temporaryReferences = createTemporaryReferenceSet();
                    response = await fetch(historyManager.getHref(nextCrumb.crumblessUrl), {
                        method: 'post',
                        headers: {Accept: 'text/x-component', ...(!actionId ? {'Content-Type': 'application/json'} : undefined)},
                        body: await encodeReply({url, sceneViewKey, rootViews: rootViews.current, actionId, args}, {temporaryReferences}),
                        signal: navigationEvent.intercept?.signal
                    });
                } catch(e) {
                    if (!navigationEvent.intercept?.signal?.aborted) throw e;
                    else return new Promise(() => {}) as Promise<Response>;
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
            const res = await createFromFetch(responsePromise);
            const {stateContext: actualStateContext} = navigationEvent.stateNavigator;
            if (actualStateContext !== currentStateContext && actualStateContext !== nextStateContext)
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
    React.useInsertionEffect?.(() => {
        const commit = navigationEvent.intercept?.commit;
        if (!isPending && commit) {
            commit();
            const title = typeof document !== 'undefined' ? document.title : null;
            const oldTitle = navigationEvent.intercept?.title;
            if (typeof document !== 'undefined' && oldTitle) document.title = oldTitle;
            window.navigation?.addEventListener('navigatesuccess', () => {
                if (typeof document !== 'undefined' && document.title === oldTitle && title) document.title = title;
            }, {once: true});
        }
    }, [isPending, navigationEvent]);
    useEffect(() => {
        if (!isPending) {
            const {stateContext: {url, historyAction}} = navigationEvent.data.stateNavigator;
            const title = typeof document !== 'undefined' ? document.title : null;
            const oldTitle = navigationEvent.intercept?.title;
            if (typeof document !== 'undefined' && oldTitle) document.title = oldTitle;
            if (typeof window !== 'undefined' && window.navigation?.transition) {
                const state = {...window.navigation.currentEntry.getState()};
                window.history.replaceState({...window.history.state}, null);
                window.navigation.updateCurrentEntry({state});
            }
            navigationEvent.intercept?.resume?.();
            if (typeof document !== 'undefined' && document.title === oldTitle && title) document.title = title;
            if (navigationEvent.intercept?.hasUAVisualTransition)
                setNavigationEvent({data: {...navigationEvent.data, ignoreCache: true, rscCache: undefined}, stateNavigator: navigationEvent.stateNavigator});
            navigationEvent.intercept = {};
            if (historyAction === 'none' || typeof window === 'undefined' || !window.history || !window.navigation) return;
            const historyKeys = Object.keys(historyCacheRef.current);
            const historyUrls = window.navigation.entries().reduce((entries, entry) => {
                if (!entry.url) return entries;
                const historyUrl = navigationEvent.stateNavigator.historyManager.getCurrentUrl(entry);
                entries[historyUrl] = true;
                return entries;
            }, {});
            historyUrls[url] = true;
            for(let i =0; i < historyKeys.length; i ++) {
                if (!historyUrls[historyKeys[i]]) delete historyCacheRef.current[url];
            }
        }
    }, [isPending, navigationEvent]);
    useEffect(() => {
        if (typeof window === 'undefined' || !createFromFetch || !supportsPrecommitNavigation) return;
        stateNavigator.historyManager.interceptHistory((navigationLink: string, {signal, hasUAVisualTransition}: NavigateEvent) => (
            new Promise((resolve, reject) => {
                const intercept = {commit: resolve, signal, hasUAVisualTransition};
                navigationEvent.data.stateNavigator.navigateLink(navigationLink, undefined, true, undefined, undefined, intercept);
                signal.addEventListener('abort', () => {
                    reject(signal.reason);
                    setTransitionAborted({});
                });
            })
        ));
    }, [navigationEvent, stateNavigator.historyManager, createFromFetch])
    useEffect(() => {
        if (stateNavigator !== navigationEvent.stateNavigator)
            raiseNavigationEvent(undefined, undefined, {});
    }, [navigationEvent, stateNavigator]);
    useEffect(() => {
        const offHmrReload = onHmrReload?.(() => {
            startTransition(() => {
                setNavigationEvent({data: {...navigationEvent.data, ignoreCache: true, rscCache: undefined}, stateNavigator: navigationEvent.stateNavigator});
            });
        });
        return offHmrReload;
    }, [navigationEvent, onHmrReload]);
    return (
        <NavigationContext.Provider value={navigationTransition.nextNavigationEvent}>
            <TransitionContext.Provider value={navigationTransition}>
                <RefetchContext.Provider value={refetchControl}>
                    <HistoryCacheContext.Provider value={historyCache}>
                        {children}
                    </HistoryCacheContext.Provider>
                </RefetchContext.Provider>
            </TransitionContext.Provider>
        </NavigationContext.Provider>
    )
}
export default NavigationHandler;
