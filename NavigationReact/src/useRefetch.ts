import { useContext } from 'react';
import { StateContext } from 'navigation';
import RSCContext from './RefetchContext.js';

const useRefetch = (refetch?: string[] | ((stateContext: StateContext) => boolean) | null) => {
    const {setRefetch, refetcher} = useContext(RSCContext);
    setRefetch(refetch);
    return refetcher;
}
export default useRefetch;
