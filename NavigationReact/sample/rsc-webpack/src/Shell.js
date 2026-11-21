'use client';
import * as React from 'react';
import { useMemo } from 'react';
import { NavigationHandler } from 'navigation-react';
import createStateNavigator from './stateNavigator.js';

const Shell = ({url, children}) => {
  const stateNavigator = useMemo(() => createStateNavigator(), [createStateNavigator]);
  return (
    <NavigationHandler stateNavigator={stateNavigator} url={url}>
      {children}
    </NavigationHandler>
  );
};

export default Shell;
