import { useCallback, useContext } from 'react';
import BundlerContext from './BundlerContext.js';
import RefetchContext from './RefetchContext.js';

const useSceneView = (fn: (...args: any) => any) => {
    const {sceneViewKey} = useContext(RefetchContext);
    const {deserialize} = useContext(BundlerContext);
    const deserializeScene = useCallback(fn.bind(null, async (actionId: string, args: any[]) => (
        deserialize(sceneViewKey, undefined, actionId, args)
    )), [fn, sceneViewKey, deserialize])
    return deserializeScene;
}
export default useSceneView;
