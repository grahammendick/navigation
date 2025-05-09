'use client'
import { useMemo, useContext, useEffect } from "react";
import { fetchRSC } from '@parcel/rsc/client';
import { StateNavigator, HTML5HistoryManager } from 'navigation';
import { NavigationHandler } from "navigation-react";
import stateNavigator from "./stateNavigator";
import HmrContext from "./HmrContext";

const historyManager = new HTML5HistoryManager();

const RootProvider = ({url, children}: any) => {
  const setRoot = useContext(HmrContext);
  const clientNavigator = useMemo(() => {
    historyManager.stop();
    const clientNavigator = new StateNavigator(stateNavigator, historyManager);
    clientNavigator.navigateLink(url);
    return clientNavigator;
  }, []);
  useEffect(() => {
    const onHmrReload = (e: any) => {
      e.preventDefault();
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
    window.addEventListener('parcelhmrreload', onHmrReload);
    return () => window.removeEventListener('parcelhmrreload', onHmrReload);
  });
  return (
    <NavigationHandler stateNavigator={clientNavigator} fetchRSC={fetchRSC}>
      {children}
    </NavigationHandler>
  )
}

export default RootProvider;
