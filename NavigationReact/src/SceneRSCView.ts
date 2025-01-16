'use client'
import { use, useDeferredValue, useContext } from "react";
import useNavigationEvent from "./useNavigationEvent";
import RSCContext from "./RSCContext";

const rscCache = new Map();

const SceneRSCView = ({active, children}) => {
    const {state, stateNavigator: {stateContext: nextStateContext}} = useNavigationEvent();
    const createFromFetch = useContext(RSCContext);
    const oldStateContext = useDeferredValue(nextStateContext);
    const stateContext = oldStateContext.crumbs.length === nextStateContext.crumbs.length
        && oldStateContext.state === nextStateContext.state ? oldStateContext : nextStateContext;
    const show = active != null && state && (
        typeof active === 'string'
        ? state.key === active
        : (
            typeof active === 'function'
            ? active(stateContext)
            : active.indexOf(state.key) !== -1
        ));
    const {url, oldUrl} = stateContext;
    if (!rscCache.get(stateContext) && oldUrl && show) {
        const res = fetch(url, {
            method: 'post',
            headers: {
                Accept: 'text/x-component',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                oldUrl,
                sceneView: active
            })
        });
        rscCache.set(stateContext, createFromFetch(res));
    }
    if (!show) return null;
    else return !oldUrl ? children : use(rscCache.get(stateContext));
};

export default SceneRSCView;
