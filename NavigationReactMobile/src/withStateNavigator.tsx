'use client'
import React from 'react';
import { NavigationContext, TransitionContext, RefetchContext } from 'navigation-react';

export default Component => props => (
    <NavigationContext.Consumer>
        {(navigationEvent) => (
            <TransitionContext.Consumer>
                {(navigationTransition) => (
                    <RefetchContext.Consumer>
                        {(refetchControl) => (
                            <Component stateNavigator={navigationEvent.stateNavigator} navigationEvent={navigationEvent} navigationTransition={navigationTransition} refetchControl={refetchControl} {...props} />
                        )}
                    </RefetchContext.Consumer>
                )}
            </TransitionContext.Consumer>
        )}
    </NavigationContext.Consumer>
);
  