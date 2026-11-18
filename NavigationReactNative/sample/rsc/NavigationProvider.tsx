'use client';
import { ReactNode, useMemo } from 'react';
import { StateNavigator } from 'navigation';
import { NavigationHandler } from 'navigation-react';
import stateNavigator from './stateNavigator';

const NavigationProvider = ({url, children}: {url: string, children: ReactNode}) => {
  const clientNavigator = useMemo(() => {
    const clientNavigator = new StateNavigator(stateNavigator);
    clientNavigator.navigateLink(url);
    return clientNavigator;
  }, [url]);
  return (
    <NavigationHandler stateNavigator={clientNavigator}>
      {children}
    </NavigationHandler>
  );
};

export default NavigationProvider;
