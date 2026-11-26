'use client';
import { useMemo } from 'react';
import { NavigationHandler } from 'navigation-react';
import createStateNavigator from './stateNavigator';

const Shell = ({url, children}: {url: string, children: any}) => {
  const stateNavigator = useMemo(() => {
    const stateNavigator = createStateNavigator();
    stateNavigator.navigateLink(url, 'replace');
    return stateNavigator;
  }, [createStateNavigator]);
  return (
    <NavigationHandler stateNavigator={stateNavigator}>
      {children}
    </NavigationHandler>
  );
};

export default Shell;
