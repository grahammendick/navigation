import { createContext } from 'react';
import { StateNavigator } from 'navigation';

const navigationEvent = {oldState: null, state: null, data: {}, stateNavigator: new StateNavigator()};
export default createContext({navigationEvent, nextNavigationEvent: navigationEvent});
