'use client'
import { use, useState } from "react";
import { createFromFetch } from "react-server-dom-parcel/client";
import useNavigationEvent from "./useNavigationEvent";

const SceneRSCView = ({active, children}) => {
    const [cache, setCache] = useState({});
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
    let rsc = cache[url];
    if (!rsc && oldUrl && show) {
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
        rsc = createFromFetch(res);
        cache[url] = rsc;
    }
    if (!show) return null;
    else return !oldUrl ? children : use(rsc);
};

export default SceneRSCView;
