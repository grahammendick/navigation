import { useCallback, useContext } from 'react';
import RefetchContext from './RefetchContext.js';
import SceneViewContext from './SceneViewContext.js';

const useSceneView = (fn: (...args: any) => any) => {
    const {deserialize} = useContext(RefetchContext);
    const {ancestors: [sceneViewKey]} = useContext(SceneViewContext);
    if (typeof window === 'undefined') return fn;
    const deserializeScene = useCallback(fn.bind(null, async (actionId: string, args: any[]) => (
        deserialize(sceneViewKey, actionId, args)
    )), [fn, sceneViewKey, deserialize])
    return deserializeScene;
}
export default useSceneView;
