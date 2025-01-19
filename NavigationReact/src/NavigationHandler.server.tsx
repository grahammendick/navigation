import { cache } from 'react';
import { StateNavigator } from 'navigation';

export const getCache = cache(() => ({navigationEvent: null}));

const NavigationHandler = ({ stateNavigator, children }: { stateNavigator: StateNavigator, children: any }) => {
    const { oldState, state, data, asyncData } = stateNavigator.stateContext;
    const navigationEvent = { oldState, state, data, asyncData, stateNavigator: navigator };
    getCache().navigationEvent = navigationEvent;
    return children;
};
export default NavigationHandler;
