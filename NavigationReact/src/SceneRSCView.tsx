'use client'
import React, { createContext, use, useContext, useEffect, useRef } from 'react';
import { SceneViewProps } from './Props.js';
import useNavigationEvent from './useNavigationEvent.js';
import BundlerContext from './BundlerContext.js';
import ErrorBoundary from './ErrorBoundary.js';

const rscCache: Map<any, Record<string, any>> = new Map();
const historyCache = {};
const RSCContext = createContext(false);

const SceneViewInner = ({children}) => children?.then ? use(children) : children;

const SceneRSCView = ({active, name, dataKeyDeps, errorFallback, children}: SceneViewProps & {active: string | string[]}) => {
    const navigationEvent = useNavigationEvent();
    const {state, oldState, data, stateNavigator: {stateContext, historyManager}} = navigationEvent;
    const {crumbs, nextCrumb: {crumblessUrl: url}, oldUrl, oldData, history, historyAction} = stateContext;
    const fetchRSC = useContext(BundlerContext);
    const ancestorFetching = useContext(RSCContext);
    const sceneViewKey = name || (typeof active === 'string' ? active : active[0]);
    const getShow = (stateKey: string) => (
        active != null && state && (
            typeof active === 'string' ? stateKey === active : active.indexOf(stateKey) !== -1
        )
    );
    const show = getShow(state.key);
    const ignoreCache = !!navigationEvent['ignoreCache'];
    const cachedHistory = !ignoreCache && history && !!historyCache[url]?.[sceneViewKey];
    if (!rscCache.get(navigationEvent)) rscCache.set(navigationEvent, {});
    const cachedSceneViews = rscCache.get(navigationEvent);
    const renderedSceneView = useRef(undefined);
    let fetchedSceneView = cachedSceneViews[sceneViewKey];
    const dataChanged = () => {
        if (!getShow(oldState?.key) || !dataKeyDeps || ignoreCache) return true;
        if (oldUrl && oldUrl.split('crumb=').length - 1 !== crumbs.length) return true;
        for(let i = 0; i < dataKeyDeps.length; i++) {
            if (data[dataKeyDeps[i]] !== oldData[dataKeyDeps[i]])
                return true;
        }
        return false;
    };
    const firstScene = !oldUrl && !ignoreCache;
    const getSceneView = () => {
        if (!show) return null;
        if (cachedHistory) return historyCache[url][sceneViewKey];
        if (firstScene || ancestorFetching) return children;
        if (dataChanged()) return fetchedSceneView;
        return renderedSceneView.current;
    }
    const oldSceneCount = (typeof window !== 'undefined' && window.history.state?.sceneCount) || 0;
    useEffect(() => {
        renderedSceneView.current = getSceneView();
        const cacheHistory = () => {
            if (historyAction === 'none' || historyManager.getCurrentUrl() !== stateContext.url) return;
            const sceneCount = window.history.state?.sceneCount || (oldSceneCount + 1);
            if (!historyCache[url]) historyCache[url] = {count: sceneCount};
            historyCache[url][sceneViewKey] = renderedSceneView.current;
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
    if (!fetchedSceneView && !cachedHistory && !firstScene && show && !ancestorFetching && dataChanged()) {
        cachedSceneViews[sceneViewKey] = fetchRSC(historyManager.getHref(url), {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: {url, sceneViewKey}
        });
        fetchedSceneView = cachedSceneViews[sceneViewKey];
    }
    return (
        <ErrorBoundary errorFallback={errorFallback}>
            <RSCContext.Provider value={ancestorFetching || dataChanged()}>
                <SceneViewInner>{getSceneView()}</SceneViewInner>
            </RSCContext.Provider>
        </ErrorBoundary>
    );
};
export default SceneRSCView;
