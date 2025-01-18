'use client'
import { use, useContext, useLayoutEffect, useRef } from "react";
import useNavigationEvent from "./useNavigationEvent";
import BundlerContext from "./BundlerContext";

const rscCache = new Map();

const SceneRSCView = ({active, name, dataDeps, children}) => {
    const {state, stateNavigator: {stateContext}} = useNavigationEvent();
    const createFromFetch = useContext(BundlerContext);
    const sceneView = name || active;
    const show = active != 'null' && state && (
        typeof active === 'string'
        ? state.key === active
        : typeof active !== 'function'
        ? active.indexOf(state.key) !== -1
        : false
    );
    const navigationDataChanged = () => {
        if (stateContext.state !== stateContext.oldState || dataDeps == null) return true;
        for(let i = 0; i < dataDeps.length; i++) {
            if (stateContext.data[dataDeps[i]] !== stateContext.oldData[dataDeps[i]])
                return true;
        }
        return false;
    }
    const {url, oldUrl} = stateContext;
    if (!rscCache.get(stateContext)) rscCache.set(stateContext, {});
    const cachedSceneViews = rscCache.get(stateContext);
    const sceneViewCurrent = useRef();
    useLayoutEffect(() => {
        if (cachedSceneViews[sceneView])
            sceneViewCurrent.current = cachedSceneViews[sceneView]
    }, [cachedSceneViews[sceneView]])
    if (!cachedSceneViews[sceneView] && oldUrl && show && navigationDataChanged()) {
        const res = fetch(url, {
            method: 'post',
            headers: {
                Accept: 'text/x-component',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                oldUrl,
                sceneView,
            })
        });
        cachedSceneViews[sceneView] = createFromFetch(res);
    }
    const cachedSceneView = cachedSceneViews[sceneView] || sceneViewCurrent.current;
    if (!show) return null;
    else return !oldUrl || !cachedSceneView ? children : use(cachedSceneView);
};

export default SceneRSCView;
