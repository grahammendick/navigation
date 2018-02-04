import * as React from 'react';

var navigationContext;
if (React.createContext)
    navigationContext = React.createContext(null);
else {
    navigationContext = {
        Provider: () => { throw Error(`React ${React.version} does not support the new context`) },
        Consumer: ({children}) => children(null)
    }
}
export default navigationContext;
