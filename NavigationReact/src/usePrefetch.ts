import { useContext, useMemo } from 'react';
import RefetchContext from './RefetchContext.js';
import useNavigationEvent from './useNavigationEvent.js';

const usePrefetch = () => {
    const {prefetcher} = useContext(RefetchContext);
    const {stateNavigator} = useNavigationEvent();
    return useMemo(() => ({
        navigate: (stateKey: string, navigationData?: any) => prefetcher(stateNavigator.getNavigationLink(stateKey, navigationData)),
        refresh: (navigationData?: any) => prefetcher(stateNavigator.getRefreshLink(navigationData)),
        navigateBack: (distance: number) => prefetcher(stateNavigator.getNavigationBackLink(distance)),
    }), [prefetcher, stateNavigator]);
}
export default usePrefetch;
