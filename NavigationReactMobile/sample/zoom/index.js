import React from 'react';
import ReactDOM from 'react-dom';
import {NavigationHandler} from 'navigation-react';
import createStateNavigator from './createStateNavigator';
import Zoom from './Zoom';

const stateNavigator = createStateNavigator();

ReactDOM.render(
  <NavigationHandler stateNavigator={stateNavigator}>
    <Zoom />
  </NavigationHandler>,
  document.getElementById('content')
)

stateNavigator.start();
