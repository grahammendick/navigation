import { useCallback, useContext } from 'react';
import BundlerContext from './BundlerContext.js';
import RefetchContext from './RefetchContext.js';

const useSceneView = (fn: (...args: any) => any) => {
    const {sceneViewKey} = useContext(RefetchContext);
    const {fetchRSC} = useContext(BundlerContext);
    const fetchScene = useCallback(fn.bind(null, async (actionId: string, args: any[]) => (
        fetchRSC(sceneViewKey, undefined, actionId, args)
    )), [fn, sceneViewKey, fetchRSC])
    return fetchScene;
}
export default useSceneView;
