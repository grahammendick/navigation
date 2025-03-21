import { cache } from 'react';
import { StateNavigator } from 'navigation';
import AsyncStateNavigator from './AsyncStateNavigator.server.js';

export const getCache = cache(() => ({navigationEvent: null}));

const NavigationHandler = ({ stateNavigator, children }: { stateNavigator: StateNavigator, children: any }) => {
    const { oldState, state, data, asyncData } = stateNavigator.stateContext;
    const serverNavigator = new AsyncStateNavigator(stateNavigator);
    getCache().navigationEvent = { oldState, state, data, asyncData, stateNavigator: serverNavigator };
    return children;
};
export default NavigationHandler;
