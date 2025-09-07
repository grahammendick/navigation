import React, { useContext } from 'react';
import NavigationContext from './NavigationContext.js';
import { SceneViewProps } from './Props.js';
import ErrorBoundary from './ErrorBoundary.js';
import NavigationRSCContext from './NavigationRSCContext.js';

const SceneViewInner = ({children}) => children;

const SceneView = ({active, errorFallback, children}: SceneViewProps) => {
    const {current} = useContext(NavigationRSCContext);
    const {state, stateNavigator} = current;
    const show = active != null && state && (
        typeof active === 'string'
        ? state.key === active
        : (
            typeof active === 'function'
            ? active(stateNavigator.stateContext)
            : active.indexOf(state.key) !== -1
        ));
    return (
        <NavigationContext.Provider value={current}>
            <ErrorBoundary errorFallback={errorFallback}>
                <SceneViewInner>
                    {show ? children : null}
                </SceneViewInner>
            </ErrorBoundary>
        </NavigationContext.Provider>
    );
}
export default SceneView;
