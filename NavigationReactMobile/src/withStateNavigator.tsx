'use client'
import React from 'react';
import { NavigationContext, NavigationDeferredContext } from 'navigation-react';

export default Component => props => (
    <NavigationContext.Consumer>
        {(navigationEvent) => (
            <NavigationDeferredContext.Consumer>
                {(navigationDeferredEvent) => (
                    <Component stateNavigator={navigationEvent.stateNavigator} navigationEvent={navigationEvent} navigationDeferredEvent={navigationDeferredEvent} {...props} />
                )}
            </NavigationDeferredContext.Consumer>
        )}
    </NavigationContext.Consumer>
);
  