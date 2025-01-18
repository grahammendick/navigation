'use client'
import { createContext, use, useCallback, useContext, useLayoutEffect, useRef } from "react";
import useNavigationEvent from "./useNavigationEvent";
import BundlerContext from "./BundlerContext";

const rscCache = new Map();
const RSCContext = createContext<() => boolean>(() => false);

const SceneRSCView = ({active, name, dataDeps, children}) => {
    const {state, oldState, data, stateNavigator: {stateContext}} = useNavigationEvent();
    const createFromFetch = useContext(BundlerContext);
    const {url, oldUrl, oldData} = stateContext;
    const ancestorFetching = useContext(RSCContext);
    const dataChanged = useCallback(() => {
        if (state !== oldState || !dataDeps) return true;
        for(let i = 0; i < dataDeps.length; i++) {
            if (data[dataDeps[i]] !== oldData[dataDeps[i]])
                return true;
        }
        return false;
    }, [stateContext, dataDeps]);
    const fetching = useCallback(() => (
        ancestorFetching() || dataChanged()
    ), [ancestorFetching, dataChanged]);
    const sceneViewKey = name || active;
    const show = active != 'null' && state && (
        typeof active === 'string'
        ? state.key === active
        : typeof active !== 'function'
        ? active.indexOf(state.key) !== -1
        : false
    );
    if (!rscCache.get(stateContext)) rscCache.set(stateContext, {});
    const cachedSceneViews = rscCache.get(stateContext);
    const renderedSceneView = useRef(undefined);
    let fetchedSceneView = cachedSceneViews[sceneViewKey];
    useLayoutEffect(() => {
        if (fetchedSceneView) renderedSceneView.current = fetchedSceneView;
        if (ancestorFetching()) renderedSceneView.current = null;
    }, [fetchedSceneView, ancestorFetching()])
    if (!fetchedSceneView && oldUrl && show && !ancestorFetching() && dataChanged()) {
        const res = fetch(url, {
            method: 'post',
            headers: {
                Accept: 'text/x-component',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                oldUrl,
                sceneView: sceneViewKey,
            })
        });
        cachedSceneViews[sceneViewKey] = createFromFetch(res);
        fetchedSceneView = cachedSceneViews[sceneViewKey];
    }
    const sceneView = !ancestorFetching() ? fetchedSceneView || renderedSceneView.current : null;
    return (
        <RSCContext.Provider value={fetching}>
            {!show ? null : !sceneView ? children : use(sceneView)}
        </RSCContext.Provider>
    );
};

export default SceneRSCView;
