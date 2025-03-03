import { ComponentType } from 'react';
import NavigationContext from './NavigationContext.js';
import { LinkProps } from './Props.js';

export default <T extends LinkProps>(Link: ComponentType<T>) => (props: T) => (
    <NavigationContext.Consumer>
        {({ stateNavigator }) => <Link {...props} stateNavigator={stateNavigator} />}
    </NavigationContext.Consumer>
);
  