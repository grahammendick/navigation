import React, {useContext, useMemo} from 'react';
import {ReactReduxContext} from 'react-redux';

const Blinkers = ({crumb, children}) => {
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

Blinkers.defaultProps = {crumb: 0}
 
export default Blinkers;