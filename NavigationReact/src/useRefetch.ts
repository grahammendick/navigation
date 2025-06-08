import { StateContext } from 'navigation';
import { useContext } from 'react';
import RSCContext from './RSCContext.js';

const useRefetch = (refetch?: string[] | ((stateContext: StateContext) => boolean) | null) => {
    const {setRefetch} = useContext(RSCContext);
    setRefetch(refetch);
}
export default useRefetch;
