import { StateNavigator } from 'navigation';
import * as React from 'react';

var navigationContext;
var defaultValue = { oldState: null, state: null, data: {}, stateNavigator: new StateNavigator(), defaultValue: true};
if (React.createContext)
    navigationContext = React.createContext(defaultValue);
else {
    navigationContext = {
        Provider: () => { throw Error(`React ${React.version} does not support the new context`) },
        Consumer: ({children}) => children(defaultValue)
    }
}
export default navigationContext;
