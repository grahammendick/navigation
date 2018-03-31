import NavigationContext from './NavigationContext';
import * as React from 'react';

export default Link => props => (
    <NavigationContext.Consumer>
        {value => <Link stateNavigator={value && value.stateNavigator} navigationContext={!!value} {...props} />}
    </NavigationContext.Consumer>
);
  