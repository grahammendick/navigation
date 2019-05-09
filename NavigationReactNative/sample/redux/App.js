import React from 'react';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import {addNavigateHandlers, Scene} from 'navigation-react-native';
import {Text, SafeAreaView} from 'react-native';

var stateNavigator = new StateNavigator([
  {key: 'grid', title: 'Colors', trackCrumbTrail: true},
]);

const { grid } = stateNavigator.states;
grid.renderScene = () => <SafeAreaView style={{flex: 1}}><Text>Hello</Text></SafeAreaView>;

stateNavigator.navigate('grid');
addNavigateHandlers(stateNavigator);

export default ({crumb}) => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <Scene crumb={crumb} />
  </NavigationHandler>
);