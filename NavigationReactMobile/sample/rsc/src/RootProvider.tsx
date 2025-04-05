'use client'
import { useMemo, useContext, useEffect } from "react";
import { fetchRSC } from '@parcel/rsc/client';
import { StateNavigator } from 'navigation';
import { NavigationHandler } from "navigation-react";
import { MobileHistoryManager } from 'navigation-react-mobile';
import stateNavigator from "./stateNavigator";
import HmrContext from "./HmrContext";

const RootProvider = ({url, children}: any) => {
  const setRoot = useContext(HmrContext);
  const clientNavigator = useMemo(() => {
    const clientNavigator = new StateNavigator(stateNavigator, new MobileHistoryManager(null, ''));
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
