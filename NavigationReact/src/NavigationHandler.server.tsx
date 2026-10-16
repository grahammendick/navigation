import { cache } from 'react';
import { StateNavigator } from 'navigation';
import asyncNavigationStorage from './AsyncNavigationStorage.js';

export const getCache = cache(() => ({ navigationEvent: null }));

const NavigationHandler = ({ stateNavigator, children }: { stateNavigator: StateNavigator, children: any }) => {
    const { oldState, state, data, asyncData } = stateNavigator.stateContext;
    getCache().navigationEvent = { oldState, state, asyncData, data: new Proxy(data, {
        get(target, key) {
            if (typeof key === 'string') asyncNavigationStorage.getStore()?.add(key);
            return target[key];
        }
    }), stateNavigator: {
        stateContext: stateNavigator.stateContext,
        states: stateNavigator.states
    }};
    return children;
};
export default NavigationHandler;
