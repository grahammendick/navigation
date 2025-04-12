import React from 'react';
import { SceneViewProps } from './Props.js';
import useNavigationEvent from './useNavigationEvent.server.js';
import SceneRSCView from './SceneRSCView.js';

const SceneView = ({active, children, ...props}: SceneViewProps & {active: string | string[]}) => {
    const {state} = useNavigationEvent();
    const show = active != null && state && (
        typeof active === 'string' ? state.key === active : active.indexOf(state.key) !== -1
    );
    return (
        <SceneRSCView active={active} {...props}>
            {show ? children : null}
        </SceneRSCView>
    );
}
export default SceneView;
