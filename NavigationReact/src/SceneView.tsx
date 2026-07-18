'use client'
import React, { useContext, useEffect } from 'react';
import NavigationContext from './NavigationContext.js';
import { SceneViewProps } from './Props.js';
import ErrorBoundary from './ErrorBoundary.js';
import RefetchContext from './RefetchContext.js';

const SceneViewInner = ({children}) => children;

const SceneView = ({active, errorFallback, client, children}: SceneViewProps) => {
    const {state, stateNavigator} = useContext(NavigationContext);
    const {registerSceneView} = useContext(RefetchContext);
    const show = active != null && state && (
        typeof active === 'string'
        ? state.key === active
        : (
            typeof active === 'function'
            ? active(stateNavigator.stateContext)
            : active.indexOf(state.key) !== -1
        ));
    useEffect(() => {
        const registerSceneViews = (elements = children) => {
            for(const sceneView of React.Children.toArray(elements) as any) {
                const {name, active, __scene, children} = sceneView.props;
                if (__scene) {
                    const sceneViewKey = name || (typeof active === 'string' ? active : active[0]);
                    registerSceneView(sceneViewKey, active);
                }
                if (children) registerSceneViews(children);
            }
        }
        if (client) registerSceneViews();
    }, [registerSceneView, client, children]);
    return (
        <ErrorBoundary errorFallback={errorFallback}>
            <SceneViewInner>
                {show ? children : null}
            </SceneViewInner>
        </ErrorBoundary>
    );
}
export default SceneView;
