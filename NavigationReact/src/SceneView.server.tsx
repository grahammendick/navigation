import { SceneViewProps } from './Props';
import useNavigationEvent from './useNavigationEvent.server';
import SceneRSCView from './SceneRSCView';

const SceneView = ({active, children}: SceneViewProps) => {
    const {state, stateNavigator} = useNavigationEvent();
    const show = active != null && state && (
        typeof active === 'string'
        ? state.key === active
        : (
            typeof active === 'function'
            ? active(stateNavigator.stateContext)
            : active.indexOf(state.key) !== -1
        ));
    return (
        <SceneRSCView active={active}> 
            {show ? children : null}
        </SceneRSCView>
    );
}

export default SceneView;
