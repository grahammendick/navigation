import React from 'react';
import ReactDOM from 'react-dom';
import {NavigationHandler} from 'navigation-react';
import createStateNavigator from './createStateNavigator';
import Medley from './Medley';

const stateNavigator = createStateNavigator();

ReactDOM.render(
  <NavigationHandler stateNavigator={stateNavigator}>
    <Medley />
  </NavigationHandler>,
  document.getElementById('content')
)

stateNavigator.start();
