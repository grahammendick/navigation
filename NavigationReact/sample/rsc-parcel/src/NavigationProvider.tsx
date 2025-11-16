'use client'
import { useMemo } from 'react';
import { StateNavigator, HTML5HistoryManager, FluentNavigator } from 'navigation';
import { NavigationHandler } from 'navigation-react';
import stateNavigator from './stateNavigator';

declare global {
    interface Window {
        oldStateNavigator:StateNavigator;
    }
}
const historyManager = new HTML5HistoryManager();

const NavigationProvider = ({url, children}: any) => {
  const clientNavigator = useMemo(() => {
    historyManager.stop();
    const clientNavigator = new StateNavigator(stateNavigator, historyManager);
    try {
      clientNavigator.navigateLink(url);
    }catch(e) {
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
