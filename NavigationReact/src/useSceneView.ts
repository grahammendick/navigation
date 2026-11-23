import { useCallback, useContext } from 'react';
import RefetchContext from './RefetchContext.js';
import SceneViewContext from './SceneViewContext.js';

const useSceneView = (fn: (...args: any) => any) => {
    const {deserialize} = useContext(RefetchContext);
    const {ancestors: [sceneViewKey]} = useContext(SceneViewContext);
    return useCallback((...args: any[]) => (
        deserialize(sceneViewKey, null, fn as any, args)
    ), [fn, sceneViewKey, deserialize]);
}
export default useSceneView;
