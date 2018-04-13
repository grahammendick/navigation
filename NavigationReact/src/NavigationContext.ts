import AsyncStateNavigator from './AsyncStateNavigator';
import { StateNavigator, StateContext } from 'navigation';
import * as React from 'react';

var asyncNavigator = new AsyncStateNavigator(null, new StateNavigator(), new StateContext());
export default React.createContext({ oldState: null, state: null, data: {}, nextState: null, nextData: {}, stateNavigator: asyncNavigator });
