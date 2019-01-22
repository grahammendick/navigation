import React from 'react';
import {render} from 'react-native';
import {NavigationHandler} from 'navigation-react';
import createStateNavigator from './createStateNavigator';
import Zoom from './Zoom';

const stateNavigator = createStateNavigator();

stateNavigator.start();

render(
  <NavigationHandler stateNavigator={stateNavigator}>
    <Zoom />
  </NavigationHandler>,
  document.getElementById('content')
)
