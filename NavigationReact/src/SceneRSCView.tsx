'use client'
import { createContext, use, useContext, useLayoutEffect, useRef } from "react";
import { SceneViewProps } from './Props';
import useNavigationEvent from "./useNavigationEvent";
import BundlerContext from "./BundlerContext";

const rscCache = new Map();
const RSCContext = createContext(false);

const SceneRSCView = ({active, name, dataKeyDeps, children}: SceneViewProps & {active: string | string[]}) => {
    const {state, oldState, data, stateNavigator: {stateContext}} = useNavigationEvent();
    const createFromFetch = useContext(BundlerContext);
    const ancestorFetching = useContext(RSCContext);
    const sceneViewKey = name || (typeof active === 'string' ? active : active[0]);
    const getShow = (stateKey: string) => (
        active != null && state && (
            typeof active === 'string' ? stateKey === active : active.indexOf(stateKey) !== -1
        )
    );
    const show = getShow(state?.key);
    if (!rscCache.get(stateContext)) rscCache.set(stateContext, {});
    const cachedSceneViews = rscCache.get(stateContext);
    const renderedSceneView = useRef(undefined);
    let fetchedSceneView = cachedSceneViews[sceneViewKey];
    useLayoutEffect(() => {
        if (fetchedSceneView) renderedSceneView.current = fetchedSceneView;
        if (ancestorFetching) renderedSceneView.current = null;
    }, [fetchedSceneView, ancestorFetching])
    const {url, oldUrl, oldData} = stateContext;
    const dataChanged = () => {
        if (!getShow(oldState?.key) || !dataKeyDeps) return true;
        for(let i = 0; i < dataKeyDeps.length; i++) {
            if (data[dataKeyDeps[i]] !== oldData[dataKeyDeps[i]])
                return true;
        }
        return false;
    };
    if (!fetchedSceneView && oldUrl && show && !ancestorFetching && dataChanged()) {
        cachedSceneViews[sceneViewKey] = createFromFetch(url, {
            method: 'post',
            headers: {
                Accept: 'text/x-component',
                'Content-Type': 'application/json'
            },
            body: {
                oldUrl,
                sceneView: sceneViewKey,
            }
        });
        fetchedSceneView = cachedSceneViews[sceneViewKey];
    }
    if (!show) return null;
    const sceneView = !ancestorFetching ? fetchedSceneView || renderedSceneView.current : null;
    return (
        <RSCContext.Provider value={ancestorFetching || dataChanged()}>
            {!sceneView ? children : use(sceneView)}
        </RSCContext.Provider>
    );
};

export default SceneRSCView;
