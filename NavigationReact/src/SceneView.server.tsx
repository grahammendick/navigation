import React from 'react';
import { SceneViewProps } from './Props.js';
import useNavigationEvent from './useNavigationEvent.server.js';
import SceneRSCView from './SceneRSCView.js';
import SceneViewClient from './SceneView.js';

const SceneView = ({active, client, children, ...props}: SceneViewProps & {active: string | string[]}) => {
    const {state} = useNavigationEvent();
    const show = active != null && state && (
        typeof active === 'string' ? state.key === active : active.indexOf(state.key) !== -1
    );
    return !client
        ? <SceneRSCView active={active} {...props}>{show ? children : null}</SceneRSCView>
        : <SceneViewClient active={active} {...props}>{children}</SceneViewClient>;
}
export default SceneView;
