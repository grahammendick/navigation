import { useCallback, useContext } from 'react';
import RefetchContext from './RefetchContext.js';
import useNavigationEvent from './useNavigationEvent.js';

const useSceneView = (fn: (...args: any) => any) => {
    const {sceneViewKey, deserialize} = useContext(RefetchContext);
    const navigationEvent = useNavigationEvent();
    if (typeof window === 'undefined') return fn;
    const deserializeScene = useCallback(fn.bind(null, async (actionId: string, args: any[]) => (
        deserialize(navigationEvent, sceneViewKey, actionId, args)
    )), [fn, sceneViewKey, deserialize])
    return deserializeScene;
}
export default useSceneView;
