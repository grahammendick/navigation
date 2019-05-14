import React from 'react';
import ReactDOM from 'react-dom';
import {NavigationHandler} from 'navigation-react';
import {Scene} from 'navigation-react-mobile';
import createStateNavigator from './createStateNavigator';
import Zoom from './Zoom';

const stateNavigator = createStateNavigator();

stateNavigator.start();

var mountScene = (crumb, el) => {
  ReactDOM.render(
    <NavigationHandler stateNavigator={stateNavigator}>
      <Scene crumb={crumb} />
    </NavigationHandler>,
    el
  )  
};

ReactDOM.render(
  <NavigationHandler stateNavigator={stateNavigator}>
    <Zoom mountScene={mountScene}/>
  </NavigationHandler>,
  document.getElementById('content')
);
