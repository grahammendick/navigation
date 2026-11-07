import { useCallback, useContext } from 'react';
import RefetchContext from './RefetchContext.js';
import SceneViewContext from './SceneViewContext.js';

const useRefetch = () => {
    const {refetcher} = useContext(RefetchContext);
    const {ancestors: [sceneViewKey]} = useContext(SceneViewContext);
    return useCallback((scene?: boolean | string) => refetcher(scene || sceneViewKey || true), [refetcher, sceneViewKey]);
}
export default useRefetch;
