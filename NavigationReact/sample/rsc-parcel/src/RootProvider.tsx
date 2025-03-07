'use client'
import { useMemo, useContext, useEffect } from "react";
import { fetchRSC } from '@parcel/rsc/client';
import { StateNavigator, HTML5HistoryManager } from 'navigation';
import { NavigationHandler } from "navigation-react";
import stateNavigator from "./stateNavigator";
import HmrContext from "./HmrContext";

const RootProvider = ({url, children}: any) => {
  const setRoot = useContext(HmrContext);
  const navigator = useMemo(() => {
    // remove app appPath!
    const navigator = new StateNavigator(stateNavigator, new HTML5HistoryManager('app'));
    navigator.navigateLink(url);
    return navigator;
  }, []);
  useEffect(() => {
    const onHmrReload = (e: any) => {
      e.preventDefault();
      const {stateContext: {state, data, crumbs, nextCrumb: {crumblessUrl}}} = navigator;
      const root = fetchRSC(navigator.historyManager.getHref(crumblessUrl), {
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
    <NavigationHandler stateNavigator={navigator} fetchRSC={fetchRSC}>
      {children}
    </NavigationHandler>
  )
}

export default RootProvider;
