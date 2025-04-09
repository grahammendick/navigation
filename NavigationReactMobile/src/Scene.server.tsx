import React from 'react';
import { useNavigationEvent, SceneRSCView } from 'navigation-react';

const Scene = ({stateKey, children}) => {
    const {state} = useNavigationEvent();
    return (
        <SceneRSCView {...{stateKey}} active={stateKey} name={stateKey}>
            {stateKey === state.key ? children : null}
        </SceneRSCView>
    );
}

export default Scene;
