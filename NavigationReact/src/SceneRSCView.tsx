'use client'
import { createContext, use, useContext, useLayoutEffect, useRef } from "react";
import { StateContext } from "navigation";
import { SceneViewProps } from './Props';
import useNavigationEvent from "./useNavigationEvent";
import BundlerContext from "./BundlerContext";
import RSCErrorBoundary from "./RSCErrorBoundary";

const rscCache: Record<string, Map<any, Record<string, any>>> = {};
const historyCache = {};
const RSCContext = createContext(false);

const SceneRSCView = ({active, name, dataKeyDeps, errorFallback, children}: SceneViewProps & {active: string | string[]}) => {
    const navigationEvent = useNavigationEvent();
    const {state, oldState, data, stateNavigator: {stateContext}} = navigationEvent;
    const {url, oldUrl, oldData, history} = stateContext;
    const fetchRSC = useContext(BundlerContext);
    const ancestorFetching = useContext(RSCContext);
    const sceneViewKey = name || (typeof active === 'string' ? active : active[0]);
    const getShow = (stateKey: string) => (
        active != null && state && (
            typeof active === 'string' ? stateKey === active : active.indexOf(stateKey) !== -1
        )
    );
    const show = getShow(state?.key);
    const ignoreCache = !!navigationEvent['ignoreCache'];
    const cachedHistory = !ignoreCache && history && !!historyCache[url]?.[sceneViewKey];
    if (!rscCache[url]) rscCache[url] = new Map();
    if (!rscCache[url].get(navigationEvent)) rscCache[url].set(navigationEvent, {});
    const cachedSceneViews = rscCache[url].get(navigationEvent);
    const renderedSceneView = useRef(undefined);
    let fetchedSceneView = cachedSceneViews[sceneViewKey];
    const dataChanged = () => {
        if (!getShow(oldState?.key) || !dataKeyDeps || ignoreCache) return true;
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
    useLayoutEffect(() => {
        if (!historyCache[url]) historyCache[url] = {};
        historyCache[url][sceneViewKey] = renderedSceneView.current = getSceneView();
    });
    if (!fetchedSceneView && !cachedHistory && !firstScene && show && !ancestorFetching && dataChanged()) {
        cachedSceneViews[sceneViewKey] = fetchRSC(url, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: {sceneViewKey}
        });
        fetchedSceneView = cachedSceneViews[sceneViewKey];
    }
    const sceneView = getSceneView();
    return (
        <RSCErrorBoundary errorFallback={errorFallback}>
            <RSCContext.Provider value={ancestorFetching || dataChanged()}>
                {sceneView?.then ? use(sceneView) : sceneView}
            </RSCContext.Provider>
        </RSCErrorBoundary>
    );
};
export default SceneRSCView;
