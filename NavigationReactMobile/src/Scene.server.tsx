import React from 'react';
import { useNavigationEvent, SceneView } from 'navigation-react';

const Scene = ({stateKey, dataKeyDeps, errorFallback, children}) => {
    const {state} = useNavigationEvent();
    return (
        <SceneView active={stateKey} name={stateKey} dataKeyDeps={dataKeyDeps} errorFallback={errorFallback}>
            {stateKey === state.key ? children : null}
        </SceneView>
    );
}

export default Scene;
