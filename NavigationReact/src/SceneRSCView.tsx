'use client'
import React, { createContext, useContext, useEffect, useRef, useMemo, useCallback } from 'react';
import { SceneViewProps } from './Props.js';
import useNavigationEvent from './useNavigationEvent.js';
import BundlerContext from './BundlerContext.js';
import RefetchContext from './RefetchContext.js';
import HistoryCacheContext from './HistoryCacheContext.js';
import ErrorBoundary from './ErrorBoundary.js';
import NavigationDeferredContext from './NavigationDeferredContext.js';
import NavigationContext from './NavigationContext.js';

const FetchingContext = createContext<(navigationEvent: any) => boolean>(() => false);

const SceneViewInner = ({children}) => children;

const SceneView = ({active, name, refetch, pending, errorFallback, children}: SceneViewProps & {active: string | string[], pending: boolean}) => {
    const navigationEvent = useNavigationEvent();
    const {state, stateNavigator: {stateContext}} = navigationEvent;
    const {url, oldUrl, history, historyAction} = stateContext;
    const historyCache = useContext(HistoryCacheContext);
    const {deserialize} = useContext(BundlerContext);
    const ancestorFetchingFn = useContext(FetchingContext);
    const ancestorFetching = ancestorFetchingFn(navigationEvent);
    const sceneViewKey = name || (typeof active === 'string' ? active : active[0]);
    const getShow = (stateKey: string) => (
        active != null && state && (
            typeof active === 'string' ? stateKey === active : active.indexOf(stateKey) !== -1
        )
    );
    const cacheIgnorable = navigationEvent['ignoreCache'];
    const ignoreCache = cacheIgnorable === true || cacheIgnorable === sceneViewKey;
    const cachedHistory = !ignoreCache && history && !!historyCache[url]?.[sceneViewKey];
    if (!navigationEvent['rscCache']) navigationEvent['rscCache'] = {};
    const cachedSceneViews = navigationEvent['rscCache'];
    const renderedSceneView = useRef({sceneView: undefined, navigationEvent: undefined});
    const fetchingFn = useCallback(((navigationEvent) => {
        const {state, oldState, data, stateNavigator: {stateContext}} = navigationEvent;
        const {crumbs, oldUrl, oldData} = stateContext;
        const cacheIgnorable = navigationEvent['ignoreCache'];
        const ignoreCache = cacheIgnorable === true || cacheIgnorable === sceneViewKey;
        if (!getShow(state?.key)) return false;
        if ((!getShow(oldState?.key) && !cacheIgnorable) || !refetch || ignoreCache) return true;
        if (oldUrl && oldUrl.split('crumb=').length - 1 !== crumbs.length) return true;
        for(let i = 0; i < refetch.length; i++) {
            if (data[refetch[i]] !== oldData[refetch[i]]) return true;
        }
        return false;
    }), [sceneViewKey, refetch]);
    const fetching = fetchingFn(navigationEvent);
    const firstScene = !oldUrl && !ignoreCache;
    if (!cachedSceneViews[sceneViewKey] && !cachedHistory && !firstScene && !ancestorFetching && fetching) {
        cachedSceneViews[sceneViewKey] = deserialize(sceneViewKey, null);
    }
    const sceneView = (() => {
        if (!getShow(state?.key)) return null;
        if (cachedHistory) return historyCache[url][sceneViewKey];
        if (cachedSceneViews[sceneViewKey]) return cachedSceneViews[sceneViewKey];
        if (firstScene || ancestorFetching) return children;
        return renderedSceneView.current.sceneView;
    })();
    useEffect(() => {
        renderedSceneView.current = {sceneView, navigationEvent};
        if (pending) return;
        if (historyAction === 'none') return;
        if (!historyCache[url]) historyCache[url] = {};
        historyCache[url][sceneViewKey] = renderedSceneView.current.sceneView;
    });
    const combinedFetchingFn = useCallback((navigationEvent) => (
        ancestorFetchingFn(navigationEvent) || fetchingFn(navigationEvent)
    ), [ancestorFetchingFn, fetchingFn]);
    return (
        <ErrorBoundary errorFallback={errorFallback}>
            <FetchingContext.Provider value={combinedFetchingFn}>
                <SceneViewInner>{sceneView}</SceneViewInner>
            </FetchingContext.Provider>
        </ErrorBoundary>
    );
};

const SceneRSCView = (props: SceneViewProps & {active: string | string[]}) => {
    const {active, refetch, name} = props;
    const {refetcher, registerSceneView} = useContext(RefetchContext);
    const navigationEvent = useNavigationEvent();
    const navigationDeferredEvent = useContext(NavigationDeferredContext);
    const sceneViewKey = name || (typeof active === 'string' ? active : active[0]);
    useEffect(() => {
        registerSceneView(sceneViewKey, active);
    }, [registerSceneView, sceneViewKey, active]);
    const refetchControl = useMemo(() => ({
        sceneViewKey,
        refetcher: (scene: boolean) => refetcher(scene || sceneViewKey),
        registerSceneView: () => {},
    }), [navigationEvent, refetcher]);
    const {state, data, stateNavigator: {stateContext}} = navigationEvent;
    const {oldData} = stateContext;
    const show =  active != null && state && (
        typeof active === 'string' ? state.key === active : active.indexOf(state.key) !== -1
    );
    const fetching = (() => {
        if (show && navigationDeferredEvent !== navigationEvent) {
            if (!refetch) return true;
            for(let i = 0; i < refetch.length; i++) {
                if (data[refetch[i]] !== oldData[refetch[i]]) return true;
            }
        }
        return false;
    })();
    return (
        <NavigationContext.Provider value={fetching ? navigationDeferredEvent : navigationEvent}>
            <NavigationDeferredContext.Provider value={navigationDeferredEvent}>
                <RefetchContext.Provider value={refetchControl}>
                    <SceneView {...props} pending={navigationEvent !== navigationDeferredEvent} />
                </RefetchContext.Provider>
            </NavigationDeferredContext.Provider>
        </NavigationContext.Provider>
    )
}

export default SceneRSCView;
