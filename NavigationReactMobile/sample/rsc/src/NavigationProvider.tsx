'use client'
import { useMemo } from 'react';
import { StateNavigator, FluentNavigator } from 'navigation';
import { NavigationHandler } from 'navigation-react';
import { MobileHistoryManager } from 'navigation-react-mobile';
import stateNavigator from './stateNavigator';

declare global {
    interface Window {
        oldStateNavigator:StateNavigator;
    }
}
const historyManager = new MobileHistoryManager(null, '');

const NavigationProvider = ({url, start, children}: any) => {
  const clientNavigator = useMemo(() => {
    historyManager.stop();
    const clientNavigator = new StateNavigator(stateNavigator, historyManager);
    var {state, data} = clientNavigator.parseLink<any>(url);
    const link = clientNavigator.fluent()
        .navigate(start)
        .navigate(state.key, data).url;
    try {
      clientNavigator.navigateLink(link);
    } catch(e) {
      if (typeof window !== 'undefined' && window.oldStateNavigator) {
        const {state, data, crumbs} = window.oldStateNavigator.stateContext;
        let fluentNavigator = clientNavigator.fluent() as FluentNavigator;
        for (let i = 0; i < crumbs.length; i++) {
          fluentNavigator = fluentNavigator.navigate(crumbs[i].state.key, crumbs[i].data);
        }
        fluentNavigator = fluentNavigator.navigate(state.key, data);
        clientNavigator.navigateLink(fluentNavigator.url);
      }
    }
    if (typeof window !== 'undefined') window.oldStateNavigator = clientNavigator;
    return clientNavigator;
  }, []);
  return (
    <NavigationHandler stateNavigator={clientNavigator}>
      {children}
    </NavigationHandler>
  )
}

export default NavigationProvider;
