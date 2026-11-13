import { useContext, useMemo } from 'react';
import RefetchContext from './RefetchContext.js';
import useNavigationEvent from './useNavigationEvent.js';

const usePrefetch = () => {
    const {prefetcher} = useContext(RefetchContext);
    const navigationEvent = useNavigationEvent();
    const {stateNavigator} = navigationEvent;
    return useMemo(() => ({
        navigate: (stateKey: string, navigationData?: any) => prefetcher(stateNavigator.getNavigationLink(stateKey, navigationData), navigationEvent),
        refresh: (navigationData?: any) => prefetcher(stateNavigator.getRefreshLink(navigationData), navigationEvent),
        navigateBack: (distance: number) => prefetcher(stateNavigator.getNavigationBackLink(distance), navigationEvent),
    }), [prefetcher, navigationEvent]);
}
export default usePrefetch;
