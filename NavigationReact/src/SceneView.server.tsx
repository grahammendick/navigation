import React, { cloneElement, createElement, isValidElement } from 'react';
import { SceneViewProps } from './Props.js';
import useNavigationEvent from './useNavigationEvent.server.js';
import asyncNavigationStorage from './AsyncNavigationStorage.js';
import SceneRSCView from './SceneRSCView.js';
import SceneViewClient from './SceneView.js';
import Refetch from './Refetch.js';

const SceneView = ({active, client, fetching, children, ...props}: SceneViewProps & {active: string | string[], fetching?: boolean}) => {
    const {state} = useNavigationEvent();
    const show = active != null && state && (
        typeof active === 'string' ? state.key === active : active.indexOf(state.key) !== -1
    );
    let pending = 0, resolve: (keys: {data: string[], state: boolean}) => void;
    const keys = {data: new Set<string>(), state: false};
    const promise = new Promise<{data: string[], state: boolean}>(res => resolve = res);
    const done = () => {
        if (--pending === 0) resolve({data: [...keys.data], state: keys.state});
    };
    const render = (node: any) => {
        if (typeof node?.then === 'function') {
            pending++;
            return node.then((tree: any) => {
                const out = render(tree);
                done();
                return out;
            }, (err: any) => {
                done();
                throw err;
            });
        }
        if (Array.isArray(node)) return node.map(render);
        if (!isValidElement<any>(node)) {
            if (!node || typeof node !== 'object' || node['$$typeof'] !== undefined) return node;
            if ([Object.prototype, null].indexOf(Object.getPrototypeOf(node)) === -1) return node;
            const out: any = {};
            for (const name in node) out[name] = render(node[name]);
            return out;
        }
        const {type, props, key} = node;
        if (type === SceneView) return node;
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
                done();
                return out;
            };
            return createElement(Wrapped, key != null ? {...props, key} : props);
        }
        const {children, ...rest} = props;
        return cloneElement(node, render(rest), ...(children !== undefined ? [].concat(render(children)) : []));
    };
    const content = (show || fetching) ? render(children) : null;
    if (pending === 0) resolve({data: [...keys.data], state: keys.state});
    if (fetching) return <Refetch keys={promise}>{content}</Refetch>;
    return !client
        ? <SceneRSCView active={active} {...{...props, __scene: true}}>{show ? <Refetch keys={promise}>{content}</Refetch> : null}</SceneRSCView>
        : <SceneViewClient active={active} client {...props}>{children}</SceneViewClient>;
}
export default SceneView;
