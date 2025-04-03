import React from 'react';
import { useNavigationEvent } from 'navigation-react';
import SceneRSC from './SceneRSC';

const Scene = ({stateKey, children}) => {
    const {state} = useNavigationEvent();
    return (
        <SceneRSC stateKey={stateKey}>
            {stateKey === state.key ? children : null}
        </SceneRSC>
    );
}

export default Scene;
