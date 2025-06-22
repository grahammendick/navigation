import { useContext } from 'react';
import { StateContext } from 'navigation';
import RSCContext from './RSCContext.js';
import SceneRSCContext from './SceneRSCContext.js';

const useRefetch = (refetch?: string[] | ((stateContext: StateContext) => boolean) | null) => {
    const {setRefetch, refetcher} = useContext(RSCContext);
    const sceneRefetcher = useContext(SceneRSCContext);
    setRefetch(refetch);
    return (scene = false) => !scene ? refetcher() : sceneRefetcher();
}
export default useRefetch;
