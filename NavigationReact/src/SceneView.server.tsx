import React from 'react';
import { SceneViewProps } from './Props.js';
import useNavigationEvent from './useNavigationEvent.server.js';
import { getCache } from './NavigationHandler.server.js';
import SceneRSCView from './SceneRSCView.js';
import SceneViewClient from './SceneView.js';
import Refetch from './Refetch.js';

const SceneView = ({active, client, fetching, children, ...props}: SceneViewProps & {active: string | string[], fetching?: boolean}) => {
    const {state} = useNavigationEvent();
    const show = active != null && state && (
        typeof active === 'string' ? state.key === active : active.indexOf(state.key) !== -1
    );
    const keys = new Set<string>();
    const {type: Component, props: childProps} = children;
    getCache().keys = keys;
    const content = (show || fetching) ? Component(childProps) : null;
    getCache().keys = null;
    if (fetching) return <Refetch keys={[...keys]}>{content}</Refetch>;
    return !client
        ? <SceneRSCView active={active} {...{...props, __scene: true}}>{show ? <Refetch keys={[...keys]}>{content}</Refetch> : null}</SceneRSCView>
        : <SceneViewClient active={active} client {...props}>{children}</SceneViewClient>;
}
export default SceneView;
