import { NavigationContext } from 'navigation-react';
import * as React from 'react';

export default Component => props => (
    <NavigationContext.Consumer>
        {value => <Component stateNavigator={value && value.stateNavigator} {...props} />}
    </NavigationContext.Consumer>
);
  