import { useCallback, useContext } from 'react';
import RefetchContext from './RefetchContext.js';
import SceneViewContext from './SceneViewContext.js';
import useNavigationEvent from './useNavigationEvent.js';

const useInvalidate = () => {
    const {invalidator} = useContext(RefetchContext);
    const {ancestors: [sceneViewKey]} = useContext(SceneViewContext);
    const navigationEvent = useNavigationEvent();
    return useCallback((scope?: boolean | string) => invalidator(scope, sceneViewKey, navigationEvent), [invalidator, sceneViewKey, navigationEvent]);
}
export default useInvalidate;
