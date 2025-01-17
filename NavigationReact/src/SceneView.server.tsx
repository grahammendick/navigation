import { SceneViewProps } from './Props';
import useNavigationEvent from './useNavigationEvent.server';
import SceneRSCView from './SceneRSCView';

const SceneView = ({active, name, children}: SceneViewProps) => {
    const {state} = useNavigationEvent();
    const show = active != null && state && (
        typeof active === 'string'
        ? state.key === active
        : typeof active !== 'function'
        ? active.indexOf(state.key) !== -1
        : false
    );
    return (
        <SceneRSCView active={active} name={name}> 
            {show ? children : null}
        </SceneRSCView>
    );
}

export default SceneView;
