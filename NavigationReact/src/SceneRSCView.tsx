'use client'
import React, { createContext, useContext, useEffect, useRef, useMemo, useState, startTransition } from 'react';
import { SceneViewProps } from './Props.js';
import useNavigationEvent from './useNavigationEvent.js';
import BundlerContext from './BundlerContext.js';
import RefetchContext from './RefetchContext.js';
import HistoryCacheContext from './HistoryCacheContext.js';
import ErrorBoundary from './ErrorBoundary.js';

const FetchingContext = createContext(false);

const SceneViewInner = ({children}) => children;

const SceneRSCView = ({active, name, refetch: serverRefetch, errorFallback, children}: SceneViewProps & {active: string | string[]}) => {
    const navigationEvent = useNavigationEvent();
    const {state, oldState, data, stateNavigator: {stateContext}} = navigationEvent;
    const {url, crumbs, oldUrl, oldData, history, historyAction} = stateContext;
    const [streaming, setStreaming] = useState(false);
    const refetchRef = useRef(serverRefetch);
    const historyCache = useContext(HistoryCacheContext);
    const {fetchRSC} = useContext(BundlerContext);
    const {refetcher, registerSceneView} = useContext(RefetchContext);
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
    if (!navigationEvent['rscCache']) navigationEvent['rscCache'] = {};
    const cachedSceneViews = navigationEvent['rscCache'];
    const renderedSceneView = useRef({sceneView: undefined, navigationEvent: undefined});
    const fetching = (() => {
        const refetch = refetchRef.current;
        if (!show) return false;
        if ((!getShow(oldState?.key) && !cacheIgnorable) || !refetch || ignoreCache) return true;
        if (oldUrl && oldUrl.split('crumb=').length - 1 !== crumbs.length) return true;
        if (typeof refetch === 'function') return refetch(stateContext);
        for(let i = 0; i < refetch.length; i++) {
            if (data[refetch[i]] !== oldData[refetch[i]]) return true;
        }
        return false;
    })();
    const firstScene = !oldUrl && !ignoreCache;
    if (!cachedSceneViews[sceneViewKey] && !cachedHistory && !firstScene && !ancestorFetching && fetching) {
        cachedSceneViews[sceneViewKey] = fetchRSC(sceneViewKey, null);
        navigationEvent['streamCache'][sceneViewKey].then(() => {
            startTransition(() => {setStreaming(false);});
        });

    }
    const sceneView = (() => {
        if (!show) return null;
        if (cachedHistory) return historyCache[url][sceneViewKey];
        if (cachedSceneViews[sceneViewKey]) return cachedSceneViews[sceneViewKey];
        if (firstScene || ancestorFetching) return children;
        return renderedSceneView.current.sceneView;
    })();
    const refetchControl = useMemo(() => ({
        sceneViewKey,
        setRefetch: (clientRefetch: any) => refetchRef.current = clientRefetch !== undefined ? clientRefetch : serverRefetch,
        refetcher: (scene: boolean) => refetcher(scene || sceneViewKey),
        registerSceneView: () => {},
    }), [navigationEvent, refetcher]);
    useEffect(() => {
        renderedSceneView.current = {sceneView, navigationEvent};
        if (historyAction === 'none') return;
        if (!historyCache[url]) historyCache[url] = {};
        historyCache[url][sceneViewKey] = renderedSceneView.current.sceneView;
    });
    useEffect(() => {
        registerSceneView(sceneViewKey, active);
    }, [registerSceneView, sceneViewKey, active]);
    console.log(sceneViewKey, streaming, 'xxx');
    return (
        <ErrorBoundary errorFallback={errorFallback}>
            <FetchingContext.Provider value={ancestorFetching || fetching}>
                <RefetchContext.Provider value={refetchControl}>
                    <SceneViewInner>{sceneView}</SceneViewInner>
                </RefetchContext.Provider>
            </FetchingContext.Provider>
        </ErrorBoundary>
    );
};

export default SceneRSCView;
