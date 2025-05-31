'use client'
import { useMemo } from 'react';
import { StateNavigator } from 'navigation';
import { NavigationHandler } from 'navigation-react';
import { MobileHistoryManager } from 'navigation-react-mobile';
import stateNavigator from './stateNavigator';

const historyManager = new MobileHistoryManager(null, '');

const NavigationProvider = ({url, start, children}: any) => {
  const clientNavigator = useMemo(() => {
    historyManager.stop();
    const clientNavigator = new StateNavigator(stateNavigator, historyManager);
    var {state, data} = clientNavigator.parseLink<any>(url);
    const link = clientNavigator.fluent()
        .navigate(start)
        .navigate(state.key, data).url;
    clientNavigator.navigateLink(link);
    return clientNavigator;
  }, []);
  return (
    <NavigationHandler stateNavigator={clientNavigator}>
      {children}
    </NavigationHandler>
  )
}

export default NavigationProvider;
