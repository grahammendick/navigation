'use client'
import { use, useContext } from "react";
import useNavigationEvent from "./useNavigationEvent";
import BundlerContext from "./BundlerContext";

const rscCache = new Map();

const SceneRSCView = ({active, name, children}) => {
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
    const {url, oldUrl} = stateContext;
    if (!rscCache.get(stateContext)) rscCache.set(stateContext, {});
    const cachedSceneViews = rscCache.get(stateContext);
    if (!cachedSceneViews[sceneView] && oldUrl && show) {
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
    if (!show) return null;
    else return !oldUrl ? children : use(cachedSceneViews[sceneView]);
};

export default SceneRSCView;
