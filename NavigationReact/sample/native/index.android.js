import React from 'react';
import { AppRegistry, BackAndroid, View } from 'react-native';
import createStateNavigator from './createStateNavigator.js';
import SceneNavigator from './SceneNavigator.js';

const App = () => (
  <View>
    <SceneNavigator stateNavigator={stateNavigator} />
  </View>
);

const stateNavigator = createStateNavigator();
stateNavigator.start('people');

BackAndroid.addEventListener('hardwareBackPress', () => {
  var canNavigateBack = stateNavigator.canNavigateBack(1);
  if (canNavigateBack)
    stateNavigator.navigateBack(1);
  return canNavigateBack;
});

AppRegistry.registerComponent('App', () => App);
