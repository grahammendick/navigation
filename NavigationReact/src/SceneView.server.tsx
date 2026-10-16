import React from 'react';
import { SceneViewProps } from './Props.js';
import useNavigationEvent from './useNavigationEvent.server.js';
import { getCache } from './NavigationHandler.server.js';
import SceneRSCView from './SceneRSCView.js';
import SceneViewClient from './SceneView.js';

const SceneView = ({active, client, children, ...props}: SceneViewProps & {active: string | string[]}) => {
    const {state} = useNavigationEvent();
    const show = active != null && state && (
        typeof active === 'string' ? state.key === active : active.indexOf(state.key) !== -1
    );
    const keys = new Set<string>();
    const {type: Component, props: childProps} = children;
    getCache().keys = keys;
    const content = show ? Component(childProps) : null;
    getCache().keys = null;
    return !client
        ? <SceneRSCView active={active} {...{...props, __scene: true, keys: show ? [...keys] : undefined}}>{content}</SceneRSCView>
        : <SceneViewClient active={active} client {...props}>{children}</SceneViewClient>;
}
export default SceneView;
