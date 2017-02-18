import React from 'react';
import {AppRegistry} from 'react-native';
import createStateNavigator from './createStateNavigator';
import Medley from './Medley';

const stateNavigator = createStateNavigator();

export default MedleyAndroid = () => (
  <Medley stateNavigator={stateNavigator} />
);

AppRegistry.registerComponent('medley', () => MedleyAndroid);
