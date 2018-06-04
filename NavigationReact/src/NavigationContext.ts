import { StateNavigator } from 'navigation';
import * as React from 'react';

export default React.createContext({ oldState: null, state: null, data: {}, nextState: null, nextData: {}, stateNavigator: new StateNavigator() });
