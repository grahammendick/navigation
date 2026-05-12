import { useCallback, useContext } from 'react';
import RefetchContext from './RefetchContext.js';

const useSceneView = (fn: (...args: any) => any) => {
    const {sceneViewKey, deserialize} = useContext(RefetchContext) as any;
    const deserializeScene = useCallback(fn.bind(null, async (actionId: string, args: any[]) => (
        deserialize(sceneViewKey, undefined, actionId, args)
    )), [fn, sceneViewKey, deserialize])
    return deserializeScene;
}
export default useSceneView;
