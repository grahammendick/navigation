'use client'
import * as React from 'react';
import { useContext, useEffect } from 'react';
import { BundlerContext, useNavigationEvent } from 'navigation-react';

const HmrProvider = ({children}) => {
  const {setRoot, deserialize} = useContext(BundlerContext);
  const {stateNavigator} = useNavigationEvent();
  useEffect(() => {
    const onHmrReload = (status) => {
      if (status !== 'idle') return;
      const {stateContext: {state, data, crumbs, nextCrumb: {crumblessUrl}}} = stateNavigator;
      const root = deserialize(stateNavigator.historyManager.getHref(crumblessUrl), {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: {
              crumbs: crumbs.map(({state, data}) => ({state: state.key, data})),
              state: state.key,
              data
          }
      });
      stateNavigator.historyManager.stop();
      setRoot(root);
    }
    import.meta.webpackHot?.addStatusHandler(onHmrReload);
    return () => import.meta.webpackHot?.removeStatusHandler(onHmrReload);
  });
  return children;
}

export default HmrProvider;
