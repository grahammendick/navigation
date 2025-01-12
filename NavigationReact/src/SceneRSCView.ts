'use client'
import { use, useMemo } from "react";
import { createFromFetch } from "react-server-dom-parcel/client";
import useNavigationEvent from "./useNavigationEvent";

const SceneRSCView = ({active, children}) => {
    const {state, stateNavigator: {stateContext}} = useNavigationEvent();
    const show = active != null && state && (
        typeof active === 'string'
        ? state.key === active
        : (
            typeof active === 'function'
            ? active(stateContext)
            : active.indexOf(state.key) !== -1
        ));
    const {url, oldUrl} = stateContext;
    const rsc = useMemo(() => {
        if (!oldUrl || !show) return null;
        const res = fetch(url, {
            headers: {Accept: "text/x-component"},
            body: JSON.stringify({
                oldUrl,
                sceneView: active
            })
        });
        return createFromFetch(res);
    }, [show, oldUrl, url]);
    if (!show) return null;
    else return !oldUrl ? children : use(rsc);
};

export default SceneRSCView;
