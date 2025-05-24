'use client'
import { useMemo, useContext, useEffect } from "react";
import { fetchRSC } from '@parcel/rsc/client';
import { StateNavigator } from 'navigation';
import { NavigationHandler } from "navigation-react";
import { NavigationStack, MobileHistoryManager } from 'navigation-react-mobile';
import stateNavigator from "./stateNavigator";
import HmrContext from "./HmrContext";

const historyManager = new MobileHistoryManager(null, '');

const RootProvider = ({url, children}: any) => {
  const setRoot = useContext(HmrContext);
  const clientNavigator = useMemo(() => {
    historyManager.stop();
    const clientNavigator = new StateNavigator(stateNavigator, historyManager);
    var {state, data} = stateNavigator.parseLink<any>(url);
    const link = stateNavigator.fluent()
        .navigate('people')
        .navigate(state.key, data).url;
    clientNavigator.navigateLink(link);
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
      <NavigationStack
        unmountStyle={[{transform: 'translateX(100%)'}, {transform: 'translateX(0)'}]}
        crumbStyle={[{transform: 'translateX(5%) scale(0.9)', opacity: 0},{transform: 'translateX(0) scale(1)', opacity: 1}]}
        style={{
          position: 'fixed',
          left: '0',
          right: '0',
          top: '0',
          bottom: '0',
          overflow: 'auto',
          backgroundColor: '#fff',
          margin: '8px',
        }}>
        {children}
      </NavigationStack>
    </NavigationHandler>
  )
}

export default RootProvider;
