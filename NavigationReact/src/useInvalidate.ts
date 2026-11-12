import { useCallback, useContext } from 'react';
import RefetchContext from './RefetchContext.js';
import SceneViewContext from './SceneViewContext.js';

const useInvalidate = () => {
    const {invalidator} = useContext(RefetchContext);
    const {ancestors: [sceneViewKey]} = useContext(SceneViewContext);
    return useCallback((scope?: boolean | string) => invalidator(scope, sceneViewKey), [invalidator, sceneViewKey]);
}
export default useInvalidate;
