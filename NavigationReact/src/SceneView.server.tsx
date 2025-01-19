import { SceneViewProps } from './Props';
import useNavigationEvent from './useNavigationEvent.server';
import SceneRSCView from './SceneRSCView';

const SceneView = ({active, dataDeps, name, children}: SceneViewProps & {active: string | string[]}) => {
    const {state} = useNavigationEvent();
    const show = active != null && state && (
        typeof active === 'string' ? state.key === active : active.indexOf(state.key) !== -1
    );
    return (
        <SceneRSCView active={active} dataDeps={dataDeps} name={name}> 
            {show ? children : null}
        </SceneRSCView>
    );
}

export default SceneView;
