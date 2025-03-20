import React, { ComponentType } from 'react';
import NavigationContext from './NavigationContext.js';

export default (Comp: ComponentType<any>) => (props: any) => (
    <NavigationContext.Consumer>
        {({ stateNavigator }) => <Comp {...props} stateNavigator={stateNavigator} />}
    </NavigationContext.Consumer>
);
  