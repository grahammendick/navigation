import { useContext } from 'react';
import NavigationContext from './NavigationContext.js';
import { SceneViewProps } from './Props.js';

const SceneView = ({active, children}: SceneViewProps) => {
    const {state, stateNavigator} = useContext(NavigationContext);
    const show = active != null && state && (
        typeof active === 'string'
        ? state.key === active
        : (
            typeof active === 'function'
            ? active(stateNavigator.stateContext)
            : active.indexOf(state.key) !== -1
        ));
    return show ? children : null;
}
export default SceneView;
