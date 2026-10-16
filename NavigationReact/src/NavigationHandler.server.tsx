import { cache } from 'react';
import { StateNavigator } from 'navigation';

export const getCache = cache(() => ({ navigationEvent: null, keys: null }));

const NavigationHandler = ({ stateNavigator, children }: { stateNavigator: StateNavigator, children: any }) => {
    const { oldState, state, data, asyncData } = stateNavigator.stateContext;
    getCache().navigationEvent = { oldState, state, asyncData, data: new Proxy(data, {
        get(target, key) {
            if (typeof key === 'string') getCache().keys?.add(key);
            return target[key];
        }
    }), stateNavigator: {
        stateContext: stateNavigator.stateContext,
        states: stateNavigator.states
    }};
    return children;
};
export default NavigationHandler;
