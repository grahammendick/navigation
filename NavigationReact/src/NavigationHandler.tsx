'use client'
import React, { use, useCallback, useContext, useDeferredValue, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { StateNavigator, StateContext, State } from 'navigation';
import NavigationContext from './NavigationContext.js';
import RefetchContext from './RefetchContext.js';
import HistoryCacheContext from './HistoryCacheContext.js';
import NavigationDeferredContext from './NavigationDeferredContext.js';
import BundlerContext from './BundlerContext.js';
type NavigationHandlerState = { ignoreCache?: boolean | string, rscNavigation?: boolean, oldState: State, state: State, data: any, asyncData: any, stateNavigator: StateNavigator };

const rscNavigationCache: Map<any, any> = new Map();

const NavigationHandler = ({stateNavigator, children}: {stateNavigator: StateNavigator, children: any}) => {
    const [navigationEvent, setNavigationEvent] = useState<{data: NavigationHandlerState, stateNavigator: StateNavigator, resumeNavigation?: () => void}>();
    const navigationDeferredEvent = useDeferredValue?.(navigationEvent) || navigationEvent;
    const [isPending, startTransition] = useTransition?.() || [false];
    const historyCacheRef = useRef({});
    const sceneViews = useRef({});
    const rscNavigation = useRef(null);
    const {deserialize, onHmrReload} = useContext(BundlerContext);
    const bundler = useMemo(() => ({
        deserialize: async (crumblessUrl: string, options: any) => {
            if (navigationEvent.data.rscNavigation && rscNavigation.current?.stateContext === navigationEvent.data.stateNavigator.stateContext) {
                return rscNavigation.current.sceneViews[options.body.sceneViewKey];
            }
            const res = await deserialize(crumblessUrl, {...options, body: {...options.body, sceneViews: sceneViews.current}});
            if (!res.url) return res.sceneViews[options.body.sceneViewKey];
            rscNavigationCache.set(navigationEvent.data, res);
            const historyCache = historyCacheRef.current;
            const {url} = options.body;
            if (!historyCache[url]) historyCache[url] = {};
            if (!historyCache[url].rscNavigation) historyCache[url].rscNavigation = new Map();
            historyCache[url].rscNavigation.set(navigationEvent.data, res);
            return null;
        },
        onHmrReload,
    }), [deserialize, onHmrReload, navigationEvent])
    const raiseNavigationEvent = useCallback((stateContext: StateContext = stateNavigator.stateContext, resumeNavigation?: () => void) => {
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
                            raiseNavigationEvent(stateContext, resumeNavigation);
                        });
                    })
                }, currentContext);
            }
        }
        const asyncNavigator = new AsyncStateNavigator()
        const {oldState, state, data, asyncData} = asyncNavigator.stateContext;
        const ignoreCache = rscNavigation.current?.stateContext === asyncNavigator.stateContext;
        setNavigationEvent({data: {oldState, state, data, asyncData, stateNavigator: asyncNavigator, ignoreCache, rscNavigation: ignoreCache}, stateNavigator, resumeNavigation});
    }, [stateNavigator]);
    if (!navigationEvent) raiseNavigationEvent();
    const refetchControl = useMemo(() => ({
        setRefetch: () => {},
        refetcher: (sceneViewKey: string | boolean = true) => {
            startTransition(() => {
                setNavigationEvent({data: {...navigationEvent.data, ignoreCache: sceneViewKey, rscNavigation: false}, stateNavigator: navigationEvent.stateNavigator});
            });
        },
        registerSceneView: (key: string, active: string | string[]) => {
            sceneViews.current[key] = active;
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
            if (rscNavigationCache.get(navigationEvent.data)) {
                const {url, sceneViews} = rscNavigationCache.get(navigationEvent.data);
                startTransition(() => {
                    navigationEvent.data.stateNavigator.navigateLink(url, 'add', false, (stateContext, resume) => {
                        rscNavigation.current = {stateContext, sceneViews};
                        resume();
                    }, stateNavigator.stateContext);
                });
                return;
            }
            navigationEvent.resumeNavigation?.();
            const {stateContext: {url, historyAction, history}} = navigationEvent.stateNavigator;
            if (historyAction === 'none' || typeof window === 'undefined' || !window.history) return;
            const historyCache = historyCacheRef.current;
            const sceneCount = window.history.state?.sceneCount || (oldSceneCount + 1);
            if (!historyCache[url]) historyCache[url] = {};
            historyCache[url].count = Math.min(historyCache[url].count || sceneCount, sceneCount);
            const historyUrls = Object.keys(historyCache);
            for(let i = 0; i < historyUrls.length && !history; i++) {
                const historyUrl = historyUrls[i];
                const gap = historyCache[historyUrl].count - sceneCount;
                if (historyUrl !== url && (gap === 0 || isNaN(gap) || (historyAction === 'add' && gap > 0)))
                    delete historyCache[historyUrl];
            }
            window.history.replaceState({...window.history.state, sceneCount}, null);
        }
    }, [isPending, navigationEvent, navigationDeferredEvent]);
    useEffect(() => {
        if (stateNavigator !== navigationEvent.stateNavigator)
            raiseNavigationEvent();
    }, [navigationEvent, stateNavigator]);
    useEffect(() => {
        const offHmrReload = onHmrReload(() => {
            startTransition(() => {
                setNavigationEvent({data: {...navigationEvent.data, ignoreCache: true, rscNavigation: false}, stateNavigator: navigationEvent.stateNavigator});
            });
        });
        return offHmrReload;
    }, [navigationEvent, onHmrReload]);
    const history = navigationEvent?.stateNavigator.stateContext.history;
    return (
        <NavigationContext.Provider value={navigationEvent?.data}>
            <NavigationDeferredContext.Provider value={!history ? navigationDeferredEvent?.data : navigationEvent?.data}>
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
