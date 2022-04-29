import React, { useContext } from 'react';
import NavigationContext from './NavigationContext';

const SceneView = ({stateKey, children}: {stateKey: string | string[], children: any}) => {
    const {state} = useContext(NavigationContext);
    const active = typeof stateKey === 'string' ? state.key === stateKey : stateKey.indexOf(state.key) !== -1;
    return active ? children : null;
}

export default SceneView;
