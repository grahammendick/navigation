import React from 'react';
import ReactDOM from 'react-dom';
import {NavigationHandler} from 'navigation-react';
import createStateNavigator from './createStateNavigator';
import Twitter from './Twitter';

const stateNavigator = createStateNavigator();

ReactDOM.render(
  <NavigationHandler stateNavigator={stateNavigator}>
    <Twitter />
  </NavigationHandler>,
  document.getElementById('content')
)

stateNavigator.start();
