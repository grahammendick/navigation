import React, {useContext, useMemo} from 'react';
import {ReactReduxContext} from 'react-redux';

export default ({crumb = 0, children}) => {
  const {store, subscription} = useContext(ReactReduxContext);

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
