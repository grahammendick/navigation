'use client'
import * as React from 'react';
import { useMemo, useEffect } from 'react';
import { StateNavigator, HTML5HistoryManager } from 'navigation';
import { NavigationHandler } from 'navigation-react';
import stateNavigator from './stateNavigator.js';

const NavigationProvider = ({url, children}) => {
  const clientNavigator = useMemo(() => {
    if (typeof oldStateNavigator !== 'undefined') oldStateNavigator.historyManager.stop();
    const clientNavigator = new StateNavigator(stateNavigator, new HTML5HistoryManager());
    try {
      clientNavigator.navigateLink(typeof oldStateNavigator === 'undefined' ? url : oldStateNavigator.stateContext.url, 'replace');
    } catch(e) {
      if (typeof oldStateNavigator !== 'undefined') {
        const {state, data, crumbs} = oldStateNavigator.stateContext;
        let fluentNavigator = clientNavigator.fluent();
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
