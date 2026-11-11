import React, { cloneElement, createElement, isValidElement } from 'react';
import { SceneViewProps } from './Props.js';
import useNavigationEvent from './useNavigationEvent.server.js';
import { getCache } from './NavigationHandler.server.js';
import asyncNavigationStorage from './AsyncNavigationStorage.js';
import SceneRSCView from './SceneRSCView.js';
import SceneViewClient from './SceneView.js';
import Refetch from './Refetch.js';

const SceneView = ({active, client, fetching, __ancestors = [], children, ...props}: SceneViewProps & {active: string | string[], fetching?: boolean, __ancestors?: string[]}) => {
    const {state} = useNavigationEvent();
    const {flattenedSceneViews} = getCache();
    const flattened = flattenedSceneViews && !client;
    const sceneViewKey = props.name || (typeof active === 'string' ? active : active[0]);
    const ancestors = [sceneViewKey, ...__ancestors];
    const show = active != null && state && (
        typeof active === 'string' ? state.key === active : active.indexOf(state.key) !== -1
    );
    if (flattened && fetching) flattenedSceneViews.start();
    let pending = 0, resolve: (keys: {data: string[], state: boolean}) => void;
    const keys = {data: new Set<string>(), state: false};
    const promise = new Promise<{data: string[], state: boolean}>(res => resolve = res);
    const complete = () => {
        resolve({data: [...keys.data], state: keys.state});
        if (flattened) flattenedSceneViews.finish();
    };
    const done = () => {
        if (--pending === 0) complete();
    };
    const render = (node: any) => {
        if (Array.isArray(node)) return node.map(render);
        if (!isValidElement<any>(node)) {
            if (!node || typeof node !== 'object' || node['$$typeof'] !== undefined) return node;
            if ([Object.prototype, null].indexOf(Object.getPrototypeOf(node)) === -1) return node;
            const out: any = {};
            for (const name in node) out[name] = render(node[name]);
            return out;
        }
        const {type, props, key} = node;
        if (type === SceneView) {
            if (!flattened || props.client) return node;
            flattenedSceneViews.start();
            return cloneElement(node, {__ancestors: ancestors});
        }
        if (type?.['$$typeof'] === Symbol.for('react.memo') || type?.['$$typeof'] === Symbol.for('react.forward_ref'))
            return render(createElement((type as any).type || (type as any).render, key != null ? {...props, key} : props));
        if (typeof type === 'function' && type['$$typeof'] !== Symbol.for('react.client.reference')) {
            pending++;
            const Wrapped = (props: any) => {
                let out;
                try {
                    out = asyncNavigationStorage.run(keys, () => render((type as any)(props)));
                } catch (e) {
                    if (e?.message?.indexOf('Suspense Exception') !== 0) done();
                    throw e;
                }
                if (typeof out?.then === 'function') {
                    const promise = out;
                    return asyncNavigationStorage.run(keys, async () => {
                        try {
                            return render(await promise);
                        } finally {
                            done();
                        }
                    });
                }
                done();
                return out;
            };
            return createElement(Wrapped, key != null ? {...props, key} : props);
        }
        const {children, ...rest} = props;
        return cloneElement(node, render(rest), ...(children !== undefined ? [].concat(render(children)) : []));
    };
    const content = !client && show ? render(children) : null;
    const refetched = <Refetch keys={promise}>{content}</Refetch>;
    if (flattened && show) flattenedSceneViews.push({key: sceneViewKey, content: refetched, ancestors});
    if (pending === 0) complete();
    if (flattened) {
        if (fetching) return null;
        return <SceneRSCView active={active} {...{...props, __scene: true}}>{show ? refetched : null}</SceneRSCView>;
    }
    if (fetching) return <Refetch keys={promise}>{content}</Refetch>;
    return !client
        ? <SceneRSCView active={active} {...{...props, __scene: true}}>{show ? <Refetch keys={promise}>{content}</Refetch> : null}</SceneRSCView>
        : <SceneViewClient active={active} client {...props}>{children}</SceneViewClient>;
}
export default SceneView;
