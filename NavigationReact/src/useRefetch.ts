import { useContext } from 'react';
import { StateContext } from 'navigation';
import RSCContext from './RSCContext.js';

const useRefetch = (refetch?: string[] | ((stateContext: StateContext) => boolean) | null) => {
    const {setRefetch} = useContext(RSCContext);
    setRefetch(refetch);
}
export default useRefetch;
