import React, {useContext, useMemo} from 'react';
import {ReactReduxContext} from 'react-redux';

export default ({crumb, children}) => {
  const {store, subscription} = useContext(ReactReduxContext);

  const contextValue = useMemo(() => ({
    store,
    subscription: {
      addNestedSub: listener => (
        subscription.addNestedSub(() => {
          if (crumb === store.getState().crumbs.current
              || crumb === store.getState().crumbs.peek)
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