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
    let pending = 0, resolve: (keys: string[]) => void;
    const keys = new Set<string>();
    const promise = new Promise<string[]>(res => resolve = res);
    const done = () => {
        if (--pending === 0) resolve([...keys]);
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
        if (!isValidElement<any>(node)) return node;
        const {type, props, key} = node;
        if (type === SceneView) return node;
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
        const config: any = {};
        for (const name in props)
            if (name !== 'children') config[name] = render(props[name]);
        return cloneElement(node, config, ...(props.children !== undefined ? [].concat(render(props.children)) : []));
    };
    const content = (show || fetching) ? render(children) : null;
    if (pending === 0) resolve([...keys]);
    if (fetching) return <Refetch keys={promise}>{content}</Refetch>;
    return !client
        ? <SceneRSCView active={active} {...{...props, __scene: true}}>{show ? <Refetch keys={promise}>{content}</Refetch> : null}</SceneRSCView>
        : <SceneViewClient active={active} client {...props}>{children}</SceneViewClient>;
}
export default SceneView;
