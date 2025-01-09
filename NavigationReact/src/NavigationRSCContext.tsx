import { cache } from 'react';

const getNavigationContext = cache(() => ({navigationEvent: null}));
export {getNavigationContext};

const NavigationRSCContext = ({stateNavigator, children}) => {
    const {oldState, state, data, asyncData} = stateNavigator.stateContext;
    const navigationEvent = {oldState, state, data, asyncData, stateNavigator};
    (getNavigationContext() as any).navigationEvent = navigationEvent;
    return children;
}

export default NavigationRSCContext;
