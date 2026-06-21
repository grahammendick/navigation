import { useContext } from 'react';
import RSCContext from './RefetchContext';

const useRefetch = () => {
    const {refetcher} = useContext(RSCContext);
    return refetcher;
}
export default useRefetch;
