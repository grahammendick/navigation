import { NavigationContext } from 'navigation-react';
import * as React from 'react';

export default Component => props => (
    <NavigationContext.Consumer>
        {({ stateNavigator }) => <Component stateNavigator={stateNavigator} {...props} />}
    </NavigationContext.Consumer>
);
  