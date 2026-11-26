'use client';
import * as React from 'react';
import { useMemo } from 'react';
import { NavigationHandler } from 'navigation-react';
import createStateNavigator from './stateNavigator.js';

const Shell = ({url, children}) => {
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
