import React, { useContext } from 'react';
import NavigationContext from './NavigationContext';
import { SceneViewProps } from './Props';

const SceneView = ({active, children}: SceneViewProps) => {
    const {state} = useContext(NavigationContext);
    const show = state && (typeof active === 'string'
        ? state.key === active : active.indexOf(state.key) !== -1);
    return show ? children : null;
}

export default SceneView;
