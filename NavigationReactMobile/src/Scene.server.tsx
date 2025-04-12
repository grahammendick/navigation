import React from 'react';
import { useNavigationEvent, SceneView } from 'navigation-react';

const Scene = ({stateKey, children, ...props}) => {
    const {state} = useNavigationEvent();
    return (
        <SceneView active={stateKey} name={stateKey} {...{...props, stateKey, __scene: true}}>
            {stateKey === state.key ? children : null}
        </SceneView>
    );
}

export default Scene;
