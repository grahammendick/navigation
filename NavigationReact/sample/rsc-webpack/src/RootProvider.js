'use client'
import * as React from 'react';
import { useMemo, useEffect, useContext } from 'react';
import ReactServerDomWebpackClient from 'react-server-dom-webpack/client';
import { StateNavigator, HTML5HistoryManager } from 'navigation';
import { NavigationHandler } from 'navigation-react';
import stateNavigator from './stateNavigator.js';
import HmrContext from './HmrContext.js';

const historyManager = new HTML5HistoryManager();

const fetchRSC = async (url, options) => {
  const {encodeReply, createFromFetch} = ReactServerDomWebpackClient;
  const response = fetch(url, {
    ...options,
    headers: {
      Accept: 'text/x-component',
      ...options?.headers,
    },
    body: options && 'body' in options 
      ? await encodeReply(options.body)
      : undefined,
  });
  return createFromFetch(response);
}

const RootProvider = ({url, children}) => {
  const setRoot = useContext(HmrContext);
  const clientNavigator = useMemo(() => {
    historyManager.stop();
    const clientNavigator = new StateNavigator(stateNavigator, historyManager);
    clientNavigator.navigateLink(url);
    return clientNavigator;
  }, []);
  useEffect(() => {
    const onHmrReload = (status) => {
      if (status !== 'idle') return;
      const {stateContext: {state, data, crumbs, nextCrumb: {crumblessUrl}}} = clientNavigator;
      const root = fetchRSC(clientNavigator.historyManager.getHref(crumblessUrl), {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: {
              crumbs: crumbs.map(({state, data}) => ({state: state.key, data})),
              state: state.key,
              data
          }
      });
      historyManager.stop();
      setRoot(root);
    }
    import.meta.webpackHot?.addStatusHandler(onHmrReload);
    return () => import.meta.webpackHot?.removeStatusHandler(onHmrReload);
  });
  return (
    <NavigationHandler stateNavigator={clientNavigator} fetchRSC={fetchRSC}>
      {children}
    </NavigationHandler>
  )
}

export default RootProvider;
