'use client'
import React, { use, useContext, useEffect, useRef, useMemo, useOptimistic, startTransition } from 'react';
import { SceneViewProps } from './Props.js';
import useNavigationEvent from './useNavigationEvent.js';
import BundlerContext from './BundlerContext.js';
import RSCContext from './RSCContext.js';
import ErrorBoundary from './ErrorBoundary.js';
import NavigationRSCContext from './NavigationDeferredContext.js';
import NavigationContext from './NavigationContext.js';

const rscCache: Map<any, Record<string, any>> = new Map();
const historyCache = {};

const SceneViewInner = ({children}) => children?.then ? use(children) : children;

const SceneView = ({active, name, refetch: serverRefetch, deferred, errorFallback, children}: SceneViewProps & {active: string | string[], deferred: boolean}) => {
    const navigationEvent = useNavigationEvent();
    const refetchRef = useRef(serverRefetch);
    const {state, oldState, data, stateNavigator: {stateContext, historyManager}} = navigationEvent;
    const {crumbs, nextCrumb, oldUrl, oldData, history, historyAction} = stateContext;
    const url = nextCrumb?.crumblessUrl;
    const {deserialize} = useContext(BundlerContext);
    const rscContext = useContext(RSCContext);
    const sceneViewKey = name || (typeof active === 'string' ? active : active[0]);
    const getShow = (stateKey: string) => (
        active != null && state && (
            typeof active === 'string' ? stateKey === active : active.indexOf(stateKey) !== -1
        )
    );
    const show = getShow(state?.key);
    const refetcherState = {ancestorFetching: rscContext.fetching, ignoreCache: !!navigationEvent['ignoreCache']};
    const [{ancestorFetching, ignoreCache}, refetcher] = useOptimistic<any, void>(refetcherState, () => ({ancestorFetching: false, ignoreCache: true}));
    const cachedHistory = !ignoreCache && history && !!historyCache[url]?.[sceneViewKey];
    if (!rscCache.get(navigationEvent)) rscCache.set(navigationEvent, {});
    const cachedSceneViews = rscCache.get(navigationEvent);
    const renderedSceneView = useRef({sceneView: undefined, navigationEvent: undefined});
    const fetching = (() => {
        const refetch = refetchRef.current;
        if (!show) return false;
        if (!getShow(oldState?.key) || !refetch || ignoreCache) return true;
        if (oldUrl && oldUrl.split('crumb=').length - 1 !== crumbs.length) return true;
        if (typeof refetch === 'function') return refetch(stateContext);
        for(let i = 0; i < refetch.length; i++) {
            if (data[refetch[i]] !== oldData[refetch[i]]) return true;
        }
        return false;
    })();
    const firstScene = !oldUrl && !ignoreCache;
    const oldSceneCount = (typeof window !== 'undefined' && window.history.state?.sceneCount) || 0;
    useEffect(() => {
        return () => {
            delete cachedSceneViews[sceneViewKey];
            if (Object.keys(cachedSceneViews).length <= 1) rscCache.delete(navigationEvent);
        };
    }, [])
    if (!cachedSceneViews[sceneViewKey] && !cachedHistory && !firstScene && !ancestorFetching && fetching) {
        cachedSceneViews[sceneViewKey] = deserialize(historyManager.getHref(url), {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: {url, sceneViewKey}
        });
    }
    const sceneView = (() => {
        if (!show) return null;
        if (cachedHistory) return historyCache[url][sceneViewKey];
        if (cachedSceneViews[sceneViewKey]) return cachedSceneViews[sceneViewKey];
        if (firstScene || ancestorFetching) return children;
        return renderedSceneView.current.sceneView;
    })();
    useEffect(() => {
        const {navigationEvent: oldNavigationEvent} = renderedSceneView.current;
        renderedSceneView.current = {sceneView, navigationEvent};
        if (!deferred && oldNavigationEvent !== navigationEvent) rscCache.delete(oldNavigationEvent);
        if (!cachedSceneViews.__committed) {
            cachedSceneViews.__committed = true;
            rscCache.forEach(({__committed}, key) => {
                if (!__committed) rscCache.delete(key);
            });
        }
        const cacheHistory = () => {
            if (historyAction === 'none' || historyManager.getCurrentUrl() !== stateContext.url) return;
            const sceneCount = window.history.state?.sceneCount || (oldSceneCount + 1);
            if (!historyCache[url]) historyCache[url] = {count: sceneCount};
            historyCache[url][sceneViewKey] = renderedSceneView.current.sceneView;
            historyCache[url].count = Math.min(historyCache[url].count, sceneCount);
            const historyUrls = Object.keys(historyCache);
            for(let i = 0; i < historyUrls.length && !history; i++) {
                const historyUrl = historyUrls[i];
                const gap = historyCache[historyUrl].count - sceneCount;
                if (historyUrl !== url && (gap === 0 || (historyAction === 'add' && gap > 0)))
                    delete historyCache[historyUrl];
            }
            window.history.replaceState({...window.history.state, sceneCount}, null);
        }
        cacheHistory();
        window.addEventListener('popstate', cacheHistory);
        return () => window.removeEventListener('popstate', cacheHistory);
    });
    const rscContextVal = useMemo(() => ({
        fetching: ancestorFetching || fetching,
        setRefetch: (refetch: any) => refetchRef.current = refetch !== undefined ? refetch : serverRefetch,
        refetcher: () => {
            startTransition(() => {
                delete cachedSceneViews[sceneViewKey];
                refetcher();
            })
        }
    }), [ancestorFetching || fetching, cachedSceneViews, refetcher]);
    return (
        <ErrorBoundary errorFallback={errorFallback}>
            <RSCContext.Provider value={rscContextVal}>
                <SceneViewInner>{sceneView}</SceneViewInner>
            </RSCContext.Provider>
        </ErrorBoundary>
    );
};

const SceneRSCView = (props: SceneViewProps & {active: string | string[]}) => {
    const {refetch} = props;
    const navigationEvent = useNavigationEvent();
    const deferredNavigationEvent = useContext(NavigationRSCContext);
    const fetching = !(typeof refetch !== 'function' && refetch?.length === 0);
    return (
        <NavigationContext.Provider value={!fetching ? navigationEvent : deferredNavigationEvent}>
            <SceneView {...props} deferred={navigationEvent !== deferredNavigationEvent} />
        </NavigationContext.Provider>
    )
}

export default SceneRSCView;
