import { useCallback, useContext } from 'react';
import BundlerContext from './BundlerContext.js';
import RefetchContext from './RefetchContext.js';

const useSceneView = (action: (...args: any) => any) => {
    const {sceneViewKey} = useContext(RefetchContext);
    const {deserialize} = useContext(BundlerContext);
    const deserializeScene = useCallback(action.bind(null, async (actionId: string, args: any[]) => (
        deserialize(sceneViewKey, undefined, actionId, args)
    )), [action, sceneViewKey, deserialize])
    return deserializeScene;
}
export default useSceneView;
