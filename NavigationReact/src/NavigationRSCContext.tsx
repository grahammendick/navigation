import { createContext } from 'react';
import { StateNavigator } from 'navigation';

export default createContext({
    current: { oldState: null, state: null, data: {}, stateNavigator: new StateNavigator() },
    deferred: { oldState: null, state: null, data: {}, stateNavigator: new StateNavigator() }
});
