import NavigationContext from './NavigationContext';
import * as React from 'react';
import { LinkProps } from './Props';

export default <T extends LinkProps>(Link: React.ComponentType<T>) => (props: T) => (
    <NavigationContext.Consumer>
        {({ stateNavigator }) => <Link {...props} stateNavigator={stateNavigator} />}
    </NavigationContext.Consumer>
);
  