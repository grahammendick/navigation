'use client'
import React from 'react';
import { NavigationContext, TransitionContext } from 'navigation-react';

export default Component => props => (
    <NavigationContext.Consumer>
        {(navigationEvent) => (
            <TransitionContext.Consumer>
                {(navigationTransition) => (
                    <Component stateNavigator={navigationEvent.stateNavigator} navigationEvent={navigationEvent} navigationTransition={navigationTransition} {...props} />
                )}
            </TransitionContext.Consumer>
        )}
    </NavigationContext.Consumer>
);
  