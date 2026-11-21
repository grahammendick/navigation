'use client';
import { useMemo } from 'react';
import { NavigationHandler } from 'navigation-react';
import createStateNavigator from './stateNavigator';

const Shell = ({url, children}: {url: string, children: any}) => {
  const stateNavigator = useMemo(() => createStateNavigator(), [createStateNavigator]);
  return (
    <NavigationHandler {...{stateNavigator, url} as any}>
      {children}
    </NavigationHandler>
  );
};

export default Shell;
