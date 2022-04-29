import React, { useContext } from 'react';
import NavigationContext from './NavigationContext';
import { SceneViewProps } from './Props';

const SceneView = ({stateKey, children}: SceneViewProps) => {
    const {state} = useContext(NavigationContext);
    const active = typeof stateKey === 'string' ? state.key === stateKey : stateKey.indexOf(state.key) !== -1;
    return active ? children : null;
}

export default SceneView;
