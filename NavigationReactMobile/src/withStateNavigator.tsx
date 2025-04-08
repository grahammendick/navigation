'use client'
import React from 'react';
import { NavigationContext } from 'navigation-react';

export default Component => props => (
    <NavigationContext.Consumer>
        {(navigationEvent) => <Component stateNavigator={navigationEvent.stateNavigator} navigationEvent={navigationEvent} {...props} />}
    </NavigationContext.Consumer>
);
  