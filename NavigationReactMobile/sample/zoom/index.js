import React from 'react';
import ReactDOM from 'react-dom';
import {NavigationHandler} from 'navigation-react';
import {Scene} from 'navigation-react-mobile';
import createStateNavigator from './createStateNavigator';
import Zoom from './Zoom';

const stateNavigator = createStateNavigator();

stateNavigator.start();

var App = ({crumb}) => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <Scene crumb={crumb} />
  </NavigationHandler>
);

ReactDOM.render(
  <NavigationHandler stateNavigator={stateNavigator}>
    <Zoom app={App}/>
  </NavigationHandler>,
  document.getElementById('content')
);
