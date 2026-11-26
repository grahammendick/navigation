'use client';
import { useMemo } from 'react';
import { NavigationHandler } from 'navigation-react';
import createStateNavigator from './stateNavigator';

const Shell = ({children}: {children: any}) => {
  const stateNavigator = useMemo(() => createStateNavigator(), [createStateNavigator]);
  return (
    <NavigationHandler stateNavigator={stateNavigator}>
      {children}
    </NavigationHandler>
  );
};

export default Shell;
