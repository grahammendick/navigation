import { Consumer } from './NavigationContext';
import * as React from 'react';

export default Link => props => (
    <Consumer>
        {value => <Link stateNavigator={value && value.stateNavigator} navigationContext={!!value} {...props} />}
    </Consumer>
);
  