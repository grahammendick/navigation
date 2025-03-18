import React from 'react';
import { SceneViewProps } from './Props.js';
import useNavigationEvent from './useNavigationEvent.server.js';
import SceneRSCView from './SceneRSCView.js';
import RSCErrorBoundary from './RSCErrorBoundary.js';

const SceneView = ({active, dataKeyDeps, name, errorFallback, children}: SceneViewProps & {active: string | string[]}) => {
    const {state} = useNavigationEvent();
    const show = active != null && state && (
        typeof active === 'string' ? state.key === active : active.indexOf(state.key) !== -1
    );
    return (
        <RSCErrorBoundary errorFallback={errorFallback}>
            <SceneRSCView active={active} dataKeyDeps={dataKeyDeps} name={name} errorFallback={errorFallback}>
                {show ? children : null}
            </SceneRSCView>
        </RSCErrorBoundary>
    );
}
export default SceneView;
