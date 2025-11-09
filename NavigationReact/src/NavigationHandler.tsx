'use client'
import React, { use, useCallback, useContext, useDeferredValue, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { StateNavigator, StateContext, State } from 'navigation';
import NavigationContext from './NavigationContext.js';
import RefetchContext from './RefetchContext.js';
import HistoryCacheContext from './HistoryCacheContext.js';
import NavigationDeferredContext from './NavigationDeferredContext.js';
import BundlerContext from './BundlerContext.js';
type NavigationHandlerState = { ignoreCache?: boolean, oldState: State, state: State, data: any, asyncData: any, stateNavigator: StateNavigator };

const rscNavigateCache: Map<any, any> = new Map();

const NavigationHandler = ({stateNavigator, children}: {stateNavigator: StateNavigator, children: any}) => {
    const [navigationEvent, setNavigationEvent] = useState<{data: NavigationHandlerState, stateNavigator: StateNavigator, resumeNavigation?: () => void}>();
    const navigationDeferredEvent = useDeferredValue?.(navigationEvent) || navigationEvent;
    const [isPending, startTransition] = useTransition?.() || [false];
    const historyCacheRef = useRef({});
    const sceneViews = useRef({});
    const rscNavigateContext = useRef(null);
    const {deserialize, setRoot} = useContext(BundlerContext);
    const bundler = useMemo(() => ({
        deserialize: async (url: string, {body, ...options}: any) => {
            if (rscNavigateContext.current && rscNavigateContext.current.stateContext === navigationEvent.data.stateNavigator.stateContext) {
                return rscNavigateContext.current.view;
            }
            const res = await deserialize(url, {...options, body: {...body, sceneViews: sceneViews.current}});
            if (res.url === body.url) return res.view;
            rscNavigateCache.set(navigationEvent.data, res);
            return null;
        },
        setRoot,
    }), [deserialize, setRoot, navigationEvent])
    if (rscNavigateCache.get(navigationDeferredEvent?.data))
        use(rscNavigateCache.get(navigationDeferredEvent.data).view._payload);
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
        const ignoreCache = rscNavigateContext.current?.stateContext === asyncNavigator.stateContext;
        setNavigationEvent({data: {oldState, state, data, asyncData, stateNavigator: asyncNavigator, ignoreCache}, stateNavigator, resumeNavigation});
    }, [stateNavigator]);
    if (!navigationEvent) raiseNavigationEvent();
    const refetchControl = useMemo(() => ({
        setRefetch: () => {},
        refetcher: () => {
            startTransition(() => {
                setNavigationEvent({data: {...navigationEvent.data, ignoreCache: true}, stateNavigator: navigationEvent.stateNavigator});
            })
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
            if (rscNavigateCache.get(navigationEvent.data)) {
                const {url, view} = rscNavigateCache.get(navigationEvent.data);
                navigationEvent.data.stateNavigator.navigateLink(url, 'add', false, (stateContext, resume) => {
                    rscNavigateContext.current = {stateContext, view};
                    resume();
                }, stateNavigator.stateContext);
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
                if (historyUrl !== url && (gap === 0 || (historyAction === 'add' && gap > 0)))
                    delete historyCache[historyUrl];
            }
            window.history.replaceState({...window.history.state, sceneCount}, null);
        }
    }, [isPending, navigationEvent, navigationDeferredEvent]);
    useEffect(() => {
        if (stateNavigator !== navigationEvent.stateNavigator)
            raiseNavigationEvent();
    }, [navigationEvent, stateNavigator]);
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
