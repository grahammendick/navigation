import { StateContext } from 'navigation';
import { useContext } from 'react';
import RSCContext from './RSCContext';

const useRefetch = (refetch?: string[] | ((stateContext: StateContext) => boolean)) => {
    const {setRefetch} = useContext(RSCContext);
    setRefetch(refetch);
}
export default useRefetch;
