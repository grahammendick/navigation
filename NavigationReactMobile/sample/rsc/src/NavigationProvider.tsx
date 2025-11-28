'use client'
import { useEffect, useMemo } from 'react';
import { StateNavigator, FluentNavigator } from 'navigation';
import { NavigationHandler } from 'navigation-react';
import { MobileHistoryManager } from 'navigation-react-mobile';
import stateNavigator from './stateNavigator';

declare global {
    let oldStateNavigator: StateNavigator;
    interface Window {
        oldStateNavigator: StateNavigator;
    }
}

const NavigationProvider = ({url, start, children}: any) => {
  const clientNavigator = useMemo(() => {
    if (typeof oldStateNavigator !== 'undefined') oldStateNavigator.historyManager.stop();
    const clientNavigator = new StateNavigator(stateNavigator, new MobileHistoryManager(null, ''));
    var {state, data} = clientNavigator.parseLink<any>(url);
    const link = clientNavigator.fluent()
        .navigate(start)
        .navigate(state.key, data).url;
    try {
      clientNavigator.navigateLink(typeof oldStateNavigator === 'undefined' ? link : oldStateNavigator.stateContext.url);
    } catch(e) {
      if (typeof oldStateNavigator !== 'undefined') {
        const {state, data, crumbs} = oldStateNavigator.stateContext;
        let fluentNavigator = clientNavigator.fluent() as FluentNavigator;
        for (let i = 0; i < crumbs.length; i++) {
          fluentNavigator = fluentNavigator.navigate(crumbs[i].state.key, crumbs[i].data);
        }
        fluentNavigator = fluentNavigator.navigate(state.key, data);
        clientNavigator.navigateLink(fluentNavigator.url);
      }
    }
    return clientNavigator;
  }, [stateNavigator]);
  useEffect(() => {
    window.oldStateNavigator = clientNavigator;
  }, [clientNavigator])
  return (
    <NavigationHandler stateNavigator={clientNavigator}>
      {children}
    </NavigationHandler>
  )
}

export default NavigationProvider;
