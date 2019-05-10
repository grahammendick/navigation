import React, {useContext, useMemo} from 'react';
import {NavigationContext} from 'navigation-react';
import {ReactReduxContext} from 'react-redux';

export default ({children}) => {
  const {store, subscription} = useContext(ReactReduxContext);
  const {stateNavigator} = useContext(NavigationContext);
  const crumb = stateNavigator.stateContext.crumbs.length;

  const contextValue = useMemo(() => ({
    store,
    subscription: {
      addNestedSub: listener => (
        subscription.addNestedSub(() => {
          const {current, peek} = store.getState().crumbs;
          if (crumb === current || crumb === peek)
            listener();
          }
        )
      )  
    }
  }), [store, subscription, crumb]);

  return (
    <ReactReduxContext.Provider value={contextValue}>
      {children}
    </ReactReduxContext.Provider>
  );  
}
