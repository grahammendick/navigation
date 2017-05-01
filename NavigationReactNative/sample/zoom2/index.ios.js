import React from 'react';
import {AppRegistry} from 'react-native';
import createStateNavigator from './createStateNavigator';
import Zoom from './Zoom';

const stateNavigator = createStateNavigator();

export default ZoomIOS = () => (
  <Zoom stateNavigator={stateNavigator} />
);

AppRegistry.registerComponent('zoom2', () => ZoomIOS);
