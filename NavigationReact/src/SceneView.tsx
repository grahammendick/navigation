'use client'
import React, { useContext, useLayoutEffect } from 'react';
import NavigationContext from './NavigationContext.js';
import { SceneViewProps } from './Props.js';
import ErrorBoundary from './ErrorBoundary.js';
import useRootViewRegistry from './useRootViewRegistry.js';
import SceneRSCView from './SceneRSCView.js';

const SceneViewInner = ({children}) => children;

const SceneView = ({active, errorFallback, client, children, ...props}: SceneViewProps) => {
    const {state, stateNavigator} = useContext(NavigationContext);
    const registerSceneView = useRootViewRegistry();
    const show = active != null && state && (
        typeof active === 'string'
        ? state.key === active
        : (
            typeof active === 'function'
            ? active(stateNavigator.stateContext)
            : active.indexOf(state.key) !== -1
        ));
    useLayoutEffect(() => {
        const registerSceneViews = (elements = children) => {
            for(const sceneView of React.Children.toArray(elements) as any) {
                const {name, active, client, __scene, children} = sceneView.props || {};
                if (__scene || (sceneView.type === SceneView && client === false)) {
                    const sceneViewKey = name || (typeof active === 'string' ? active : active[0]);
                    registerSceneView(sceneViewKey, active);
                } else if (children) registerSceneViews(children);
            }
        }
        if (client) registerSceneViews();
    }, [registerSceneView, client, children]);
    if (client === false) return <SceneRSCView {...{...props, active, errorFallback} as any} />;
    return (
        <ErrorBoundary errorFallback={errorFallback}>
            <SceneViewInner>
                {show ? children : null}
            </SceneViewInner>
        </ErrorBoundary>
    );
}
export default SceneView;
