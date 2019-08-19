import React from 'react';
import { requireNativeComponent } from 'react-native';
import { NavigationContext } from 'navigation-react';

var SharedElement = ({navigationEvent, transition, ...props}) => {
    var crumb = navigationEvent.stateNavigator.stateContext.crumbs.length;
    var enterTransition = typeof transition !== 'function' ? transition : transition(true);
    var exitTransition = typeof transition !== 'function' ? transition : transition(false);
    return (
        <NVSharedElement
            crumb={crumb}
            enterTransition={enterTransition}
            exitTransition={exitTransition}
            {...props} />
    );
};
var NVSharedElement = requireNativeComponent<any>('NVSharedElement', null);


export default props => (
    <NavigationContext.Consumer>
        {(navigationEvent) => <SharedElement navigationEvent={navigationEvent} {...props} />}
    </NavigationContext.Consumer>
)
