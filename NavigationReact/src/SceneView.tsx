import React, { useContext } from 'react';
import NavigationContext from './NavigationContext.js';
import { SceneViewProps } from './Props.js';
import ErrorBoundary from './ErrorBoundary.js';

const SceneViewInner = ({children}) => children;

const SceneView = ({active, errorFallback, children}: SceneViewProps) => {
    const {state, stateNavigator} = useContext(NavigationContext);
    const show = active != null && state && (
        typeof active === 'string'
        ? state.key === active
        : (
            typeof active === 'function'
            ? active(stateNavigator.stateContext)
            : active.indexOf(state.key) !== -1
        ));
    return (
        <ErrorBoundary errorFallback={errorFallback}>
            <SceneViewInner>
                {show ? children : null}
            </SceneViewInner>
        </ErrorBoundary>
    );
}
export default SceneView;
