'use client'
import React, { use, createContext, useContext, useEffect, useRef, useMemo, startTransition, useState } from 'react';
import { SceneViewProps } from './Props.js';
import useNavigationEvent from './useNavigationEvent.js';
import BundlerContext from './BundlerContext.js';
import RefetchContext from './RefetchContext.js';
import HistoryCacheContext from './HistoryCacheContext.js';
import ErrorBoundary from './ErrorBoundary.js';
import NavigationDeferredContext from './NavigationDeferredContext.js';
import NavigationContext from './NavigationContext.js';

const rscCache: Map<any, {[index: string]: any}> = new Map();
const FetchingContext = createContext(false);

const SceneViewInner = ({children}) => children?.then ? use(children) : children;

const SceneView = ({active, name, refetch, pending, errorFallback, children}: SceneViewProps & {active: string | string[], pending: boolean}) => {
    const navigationEvent = useNavigationEvent();
    const {state, oldState, data, stateNavigator: {stateContext, historyManager}} = navigationEvent;
    const {url, crumbs, nextCrumb, oldUrl, oldData, history, historyAction} = stateContext;
    const historyCache = useContext(HistoryCacheContext);
    const {deserialize} = useContext(BundlerContext);
    const ancestorFetching = useContext(FetchingContext);
    const sceneViewKey = name || (typeof active === 'string' ? active : active[0]);
    const getShow = (stateKey: string) => (
        active != null && state && (
            typeof active === 'string' ? stateKey === active : active.indexOf(stateKey) !== -1
        )
    );
    const show = getShow(state?.key);
    const cacheIgnorable = navigationEvent['ignoreCache'];
    const ignoreCache = cacheIgnorable === true || cacheIgnorable === sceneViewKey;
    const cachedHistory = !ignoreCache && history && !!historyCache[url]?.[sceneViewKey];
    if (!rscCache.get(navigationEvent)) rscCache.set(navigationEvent, {});
    const cachedSceneViews = rscCache.get(navigationEvent);
    const renderedSceneView = useRef({sceneView: undefined, navigationEvent: undefined});
    const fetching = (() => {
        if (!show || cachedSceneViews.__committed) return false;
        if ((!getShow(oldState?.key) && !cacheIgnorable) || !refetch || ignoreCache) return true;
        if (oldUrl && oldUrl.split('crumb=').length - 1 !== crumbs.length) return true;
        if (typeof refetch === 'function') return refetch(stateContext);
        for(let i = 0; i < refetch.length; i++) {
            if (data[refetch[i]] !== oldData[refetch[i]]) return true;
        }
        return false;
    })();
    const firstScene = !oldUrl && !ignoreCache;
    useEffect(() => {
        return () => {
            delete cachedSceneViews[sceneViewKey];
            if (Object.keys(cachedSceneViews).length <= 1) rscCache.delete(navigationEvent);
        };
    }, [])
    if (!cachedSceneViews[sceneViewKey] && !cachedHistory && !firstScene && !ancestorFetching && fetching) {
        cachedSceneViews[sceneViewKey] = deserialize(historyManager.getHref(nextCrumb.crumblessUrl), {
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
        if (pending) return;
        if (oldNavigationEvent !== navigationEvent) rscCache.delete(oldNavigationEvent);
        if (!cachedSceneViews.__committed) {
            cachedSceneViews.__committed = true;
            rscCache.forEach(({__committed}, key) => {
                if (!__committed) rscCache.delete(key);
            });
        }
        if (historyAction === 'none') return;
        if (!historyCache[url]) historyCache[url] = {};
        historyCache[url][sceneViewKey] = renderedSceneView.current.sceneView;
    });
    return (
        <ErrorBoundary errorFallback={errorFallback}>
            <FetchingContext.Provider value={ancestorFetching || fetching}>
                <SceneViewInner>{sceneView}</SceneViewInner>
            </FetchingContext.Provider>
        </ErrorBoundary>
    );
};

const SceneRSCView = (props: SceneViewProps & {active: string | string[]}) => {
    const {refetch: serverRefetch, active, name} = props;
    const refetchRef = useRef(serverRefetch);
    const {refetcher, registerSceneView} = useContext(RefetchContext);
    const navigationEvent = useNavigationEvent();
    const navigationDeferredEvent = useContext(NavigationDeferredContext);
    const sceneViewKey = name || (typeof active === 'string' ? active : active[0]);
    useEffect(() => {
        registerSceneView(sceneViewKey, active);
    }, [registerSceneView, sceneViewKey, active]);
    const refetchControl = useMemo(() => ({
        setRefetch: (clientRefetch: any) => refetchRef.current = clientRefetch !== undefined ? clientRefetch : serverRefetch,
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
            const refetch = refetchRef.current;
            if (!refetch) return true;
            if (typeof refetch === 'function') return refetch(stateContext);
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
                    <SceneView {...props} refetch={refetchRef.current} pending={navigationEvent !== navigationDeferredEvent} />
                </RefetchContext.Provider>
            </NavigationDeferredContext.Provider>
        </NavigationContext.Provider>
    )
}

export default SceneRSCView;
