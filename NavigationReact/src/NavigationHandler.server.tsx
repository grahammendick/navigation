import { cache } from 'react';
import { StateNavigator } from 'navigation';
import AsyncStateNavigator from './AsyncStateNavigator.server';

export const getCache = cache(() => ({navigationEvent: null}));

const NavigationHandler = ({ stateNavigator, children }: { stateNavigator: StateNavigator, children: any }) => {
    const { oldState, state, data, asyncData } = stateNavigator.stateContext;
    const asyncStateNavigator = new AsyncStateNavigator(stateNavigator);
    getCache().navigationEvent = { oldState, state, data, asyncData, stateNavigator: asyncStateNavigator };
    return children;
};
export default NavigationHandler;
