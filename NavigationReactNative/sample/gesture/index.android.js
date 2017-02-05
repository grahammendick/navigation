import React from 'react';
import {AppRegistry} from 'react-native';
import createStateNavigator from './createStateNavigator';
import Gesture from './Gesture';

const stateNavigator = createStateNavigator();

export default GestureAndroid = () => (
  <Gesture stateNavigator={stateNavigator} />
);

AppRegistry.registerComponent('gesture', () => GestureAndroid);
