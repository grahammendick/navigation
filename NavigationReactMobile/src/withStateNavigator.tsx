'use client'
import { NavigationContext } from 'navigation-react';
import * as React from 'react';

export default Component => props => (
    <NavigationContext.Consumer>
        {(navigationEvent) => <Component stateNavigator={navigationEvent.stateNavigator} navigationEvent={navigationEvent} {...props} />}
    </NavigationContext.Consumer>
);
  