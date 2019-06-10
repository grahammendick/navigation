import React from 'react';
import {NavigationHandler} from 'navigation-react';
import {NavigationStack} from 'navigation-react-native';
import createStateNavigator from './createStateNavigator';

var stateNavigator = createStateNavigator();
stateNavigator.navigate('grid');

export default () => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <NavigationStack sharedElements={(_, {color}) => color && [color]} />
  </NavigationHandler>
);
