import NavigationContext from './NavigationContext';
import React, { ComponentType } from 'react';
import { LinkProps } from './Props';

export default <T extends LinkProps>(Link: ComponentType<T>) => (props: T) => (
    <NavigationContext.Consumer>
        {({ stateNavigator }) => <Link {...props} stateNavigator={stateNavigator} />}
    </NavigationContext.Consumer>
);
  