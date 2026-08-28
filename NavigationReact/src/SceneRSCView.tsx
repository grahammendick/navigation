'use client'
import React, { createContext, useContext, useEffect, useRef, useMemo, useCallback, Suspense } from 'react';
import { SceneViewProps } from './Props.js';
import useNavigationEvent from './useNavigationEvent.js';
import RefetchContext from './RefetchContext.js';
import HistoryCacheContext from './HistoryCacheContext.js';
import ErrorBoundary from './ErrorBoundary.js';
import NavigationDeferredContext from './TransitionContext.js';
import NavigationContext from './NavigationContext.js';

const FetchingContext = createContext<(navigationEvent: any) => boolean>(() => false);

const SceneViewInner = ({children, onMount}) => {
    useEffect(() => {
        onMount();
    }, [onMount]);
    return children
};

const SceneView = ({active, name, refetch, pending, fallback, errorFallback, children}: SceneViewProps & {active: string | string[], pending: boolean}) => {
    const navigationEvent = useNavigationEvent();
    const {state, stateNavigator: {stateContext}} = navigationEvent;
    const {oldUrl, historyAction} = stateContext;
    const historyCache = useContext(HistoryCacheContext);
    const {deserialize} = useContext(RefetchContext);
    const suspended = useRef(null);
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
    const cachedHistory = !ignoreCache && historyCache.get(navigationEvent, sceneViewKey);
    if (!navigationEvent['rscCache']) navigationEvent['rscCache'] = {};
    const cachedSceneViews = navigationEvent['rscCache'];
    if (cachedHistory) cachedSceneViews[sceneViewKey] = cachedHistory;
    const renderedSceneView = useRef(null);
    const fetchingFn = useCallback(((navigationEvent) => {
        const {state, oldState, data, stateNavigator: {stateContext}} = navigationEvent;
        const {crumbs, oldUrl, oldData} = stateContext;
        const cacheIgnorable = navigationEvent['ignoreCache'];
        const ignoreCache = cacheIgnorable === true || cacheIgnorable === sceneViewKey;
        if (!getShow(state?.key)) return false;
        if ((!getShow(oldState?.key) && !cacheIgnorable) || !refetch || ignoreCache) return true;
        if (navigationEvent['rscCache'][sceneViewKey] || suspended.current) return true;
        if (oldUrl && oldUrl.split('crumb=').length - 1 !== crumbs.length) return true;
        for(let i = 0; i < refetch.length; i++) {
            if (data[refetch[i]] !== oldData[refetch[i]]) return true;
        }
        return false;
    }), [sceneViewKey, refetch]);
    const fetching = fetchingFn(navigationEvent);
    const firstScene = !oldUrl && !ignoreCache;
    if (!cachedSceneViews[sceneViewKey] && !firstScene && !ancestorFetching && fetching) {
        cachedSceneViews[sceneViewKey] = deserialize(sceneViewKey);
    }
    const sceneView = (() => {
        if (!getShow(state?.key)) return null;
        if (cachedSceneViews[sceneViewKey]) return cachedSceneViews[sceneViewKey];
        if (firstScene || ancestorFetching) return children;
        return renderedSceneView.current;
    })();
    const combinedFetchingFn = useCallback((navigationEvent) => (
        ancestorFetchingFn(navigationEvent) || fetchingFn(navigationEvent)
    ), [ancestorFetchingFn, fetchingFn]);
    return (
        <ErrorBoundary errorFallback={errorFallback}>
            {(() => {
                const view = (
                    <FetchingContext.Provider value={combinedFetchingFn}>
                        <SceneViewInner onMount={() => {
                            renderedSceneView.current = sceneView;
                            if (pending) return;
                            if (historyAction === 'none') return;
                            if (typeof window !== 'undefined') historyCache.set(navigationEvent, sceneViewKey, renderedSceneView.current);
                        }}>{sceneView}</SceneViewInner>
                    </FetchingContext.Provider>
                );
                return fallback ? <Suspense fallback={<div ref={suspended}>{fallback}</div>}>{view}</Suspense> : view;
            })()}
        </ErrorBoundary>
    );
};

const SceneRSCView = (props: SceneViewProps & {active: string | string[]}) => {
    const {active, refetch, name} = props;
    const {refetcher, registerSceneView, deserialize} = useContext(RefetchContext);
    const ancestorNavigationEvent = useNavigationEvent();
    const {navigationEvent, nextNavigationEvent} = useContext(NavigationDeferredContext);
    const sceneViewKey = name || (typeof active === 'string' ? active : active[0]);
    useEffect(() => {
        registerSceneView(sceneViewKey, active);
    }, [registerSceneView, sceneViewKey, active]);
    const refetchControl = useMemo(() => ({
        sceneViewKey,
        refetcher: (scene: boolean) => refetcher(scene || sceneViewKey),
        registerSceneView: () => {},
        deserialize,
    }), [sceneViewKey, refetcher, deserialize]);
    const {state, data, oldState, stateNavigator: {stateContext}} = nextNavigationEvent;
    const {oldData} = stateContext;
    const getShow = (stateKey: string) => (
        active != null && state && (
            typeof active === 'string' ? stateKey === active : active.indexOf(stateKey) !== -1
        )
    );
    const navEvent = (() => {
        if (!getShow(state?.key) || !getShow(oldState?.key)) return navigationEvent;
        if (!refetch) return navigationEvent;
        for(let i = 0; i < refetch.length; i++) {
            if (data[refetch[i]] !== oldData[refetch[i]]) return navigationEvent;
        }
        return ancestorNavigationEvent;
    })();
    return (
        <NavigationContext.Provider value={navEvent}>
            <RefetchContext.Provider value={refetchControl}>
                <SceneView {...props} pending={navigationEvent !== nextNavigationEvent} />
            </RefetchContext.Provider>
        </NavigationContext.Provider>
    )
}

export default SceneRSCView;
