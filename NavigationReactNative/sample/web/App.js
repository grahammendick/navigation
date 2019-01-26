import React from 'react';
import {NavigationHandler} from 'navigation-react';
import {addNavigateHandlers, Scene} from 'navigation-react-native';
import createStateNavigator from './createStateNavigator';

var stateNavigator = createStateNavigator();

const {detail} = stateNavigator.states;
detail.getSharedElements = ({color}) => [color];

stateNavigator.navigate('grid');
addNavigateHandlers(stateNavigator);

export default ({crumb}) => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <Scene crumb={crumb} />
  </NavigationHandler>
);
