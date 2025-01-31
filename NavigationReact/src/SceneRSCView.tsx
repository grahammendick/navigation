'use client'
import { createContext, use, useContext, useLayoutEffect, useRef } from "react";
import { SceneViewProps } from './Props';
import useNavigationEvent from "./useNavigationEvent";
import BundlerContext from "./BundlerContext";
import RSCErrorBoundary from "./RSCErrorBoundary";

const rscCache = {};
const historyCache = {};
const RSCContext = createContext(false);

const SceneRSCView = ({active, name, dataKeyDeps, errorFallback, children}: SceneViewProps & {active: string | string[]}) => {
    const {state, oldState, data, stateNavigator: {stateContext}} = useNavigationEvent();
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
    const cachedHistory = history && historyCache[url];
    if (rscCache[url]?.stateContext !== stateContext) rscCache[url] = {stateContext};
    const cachedSceneViews = rscCache[url];
    const renderedSceneView = useRef(undefined);
    let fetchedSceneView = cachedSceneViews[sceneViewKey];
    const getSceneView = () => {
        if (!show) return null;
        if (cachedHistory) return historyCache[url][sceneViewKey];
        if (!oldUrl || ancestorFetching) return children;
        if (dataChanged()) return fetchedSceneView;
        return renderedSceneView.current;
    }
    useLayoutEffect(() => {
        if (!historyCache[url]) historyCache[url] = {};
        historyCache[url][sceneViewKey] = renderedSceneView.current = getSceneView();
    });
    const dataChanged = () => {
        if (!getShow(oldState?.key) || !dataKeyDeps) return true;
        for(let i = 0; i < dataKeyDeps.length; i++) {
            if (data[dataKeyDeps[i]] !== oldData[dataKeyDeps[i]])
                return true;
        }
        return false;
    };
    if (!fetchedSceneView && !cachedHistory && oldUrl && show && !ancestorFetching && dataChanged()) {
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
