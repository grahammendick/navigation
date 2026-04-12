import { useCallback, useContext } from 'react';
import BundlerContext from './BundlerContext.js';
import RefetchContext from './RefetchContext.js';

const useSceneView = (fn: (...args: any) => any) => {
    const {sceneViewKey} = useContext(RefetchContext);
    const {deserialize} = useContext(BundlerContext);
    return useCallback(fn.bind(null, async (actionId: string, args: any[]) => (
        deserialize(sceneViewKey, undefined, actionId, args)
    )), [fn, sceneViewKey, deserialize])
}

export default useSceneView;
