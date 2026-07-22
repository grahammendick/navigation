'use client'
import React, { createContext, useContext, useEffect, useRef, useMemo, useCallback } from 'react';
import { SceneViewProps } from './Props.js';
import useNavigationEvent from './useNavigationEvent.js';
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
    const {oldUrl, historyAction} = stateContext;
    const historyCache = useContext(HistoryCacheContext);
    const {deserialize} = useContext(RefetchContext);
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
    useEffect(() => {
        renderedSceneView.current = sceneView;
        if (pending) return;
        if (historyAction === 'none') return;
        if (typeof window !== 'undefined') historyCache.set(navigationEvent, sceneViewKey, renderedSceneView.current);
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
    const rendered = useRef(false);
    const {refetcher, registerSceneView, deserialize} = useContext(RefetchContext);
    const navigationEvent = useNavigationEvent();
    const navigationDeferredEvent = useContext(NavigationDeferredContext);
    const sceneViewKey = name || (typeof active === 'string' ? active : active[0]);
    useEffect(() => {
        registerSceneView(sceneViewKey, active);
    }, [registerSceneView, sceneViewKey, active]);
    useEffect(() => {
        rendered.current = true;
    }, []);
    const refetchControl = useMemo(() => ({
        sceneViewKey,
        refetcher: (scene: boolean) => refetcher(scene || sceneViewKey),
        registerSceneView: () => {},
        deserialize,
    }), [navigationEvent, refetcher, deserialize]);
    const {state, data, stateNavigator: {stateContext}} = navigationEvent;
    const {oldData} = stateContext;
    const show =  active != null && state && (
        typeof active === 'string' ? state.key === active : active.indexOf(state.key) !== -1
    );
    const refetching = (() => {
        if (rendered.current && show && navigationDeferredEvent !== navigationEvent) {
            if (!refetch) return true;
            for(let i = 0; i < refetch.length; i++) {
                if (data[refetch[i]] !== oldData[refetch[i]]) return true;
            }
        }
        return false;
    })();
    return (
        <NavigationContext.Provider value={refetching ? navigationDeferredEvent : navigationEvent}>
            <NavigationDeferredContext.Provider value={navigationDeferredEvent}>
                <RefetchContext.Provider value={refetchControl}>
                    <SceneView {...props} pending={navigationEvent !== navigationDeferredEvent} />
                </RefetchContext.Provider>
            </NavigationDeferredContext.Provider>
        </NavigationContext.Provider>
    )
}

export default SceneRSCView;
