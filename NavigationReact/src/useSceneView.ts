import { useCallback, useContext } from 'react';
import RefetchContext from './RefetchContext';

const useSceneView = (fn: (...args: any) => any) => {
    const {sceneViewKey, deserialize} = useContext(RefetchContext);
    const deserializeScene = useCallback(fn.bind(null, async (actionId: string, args: any[]) => (
        deserialize(sceneViewKey, actionId, args)
    )), [fn, sceneViewKey, deserialize])
    return deserializeScene;
}
export default useSceneView;
