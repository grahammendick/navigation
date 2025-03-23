import { createContext } from 'react';
import { StateNavigator } from 'navigation';

export default createContext({ oldState: null, state: null, data: {}, stateNavigator: new StateNavigator() });
