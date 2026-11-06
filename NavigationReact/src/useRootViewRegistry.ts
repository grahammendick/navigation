import { useContext } from 'react';
import RefetchContext from './RefetchContext.js';
import SceneViewContext from './SceneViewContext.js';

const noop = () => {};

const useRootViewRegistry = () => {
    const {registerSceneView} = useContext(RefetchContext);
    const {sceneViewKey} = useContext(SceneViewContext);
    return sceneViewKey == null ? registerSceneView : noop;
}
export default useRootViewRegistry;
