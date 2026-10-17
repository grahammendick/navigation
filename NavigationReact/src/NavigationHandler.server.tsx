import { cache } from 'react';
import { StateNavigator } from 'navigation';
import asyncNavigationStorage from './AsyncNavigationStorage.js';

export const getCache = cache(() => ({ navigationEvent: null }));

const NavigationHandler = ({ stateNavigator, children }: { stateNavigator: StateNavigator, children: any }) => {
    const { oldState, state, data, asyncData } = stateNavigator.stateContext;
    const dataProxy = new Proxy(data, {
        get(target, key) {
            if (typeof key === 'string') asyncNavigationStorage.getStore()?.data.add(key);
            return target[key];
        }
    });
    const getState = () => {
        const keys = asyncNavigationStorage.getStore();
        if (keys) keys.state = true;
        return state;
    };
    getCache().navigationEvent = { oldState, get state() { return getState(); }, asyncData, data: dataProxy, stateNavigator: {
        stateContext: new Proxy(stateNavigator.stateContext, {
            get(target, key) {
                if (key === 'data') return dataProxy;
                if (key === 'state') return getState();
                return target[key];
            }
        }),
        states: stateNavigator.states
    }};
    return children;
};
export default NavigationHandler;
