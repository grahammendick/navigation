import React from 'react';
import ReactDOM from 'react-dom';
import {NavigationHandler} from 'navigation-react';
import {Scene} from 'navigation-react-mobile';
import createStateNavigator from './createStateNavigator';
import Medley from './Medley';

const stateNavigator = createStateNavigator();

stateNavigator.start();

var App = ({crumb}) => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <Scene crumb={crumb} />
  </NavigationHandler>
);

ReactDOM.render(
  <NavigationHandler stateNavigator={stateNavigator}>
    <Medley app={App} />
  </NavigationHandler>,
  document.getElementById('content')
)
