import * as React from 'react';

var navigationContext;
if (React.createContext)
  navigationContext = React.createContext(null); 
else
  navigationContext = { Provider: null, Consumer: ({children}) => children(null)}
export default navigationContext;
