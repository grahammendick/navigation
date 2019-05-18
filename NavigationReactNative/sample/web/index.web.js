import React from 'react';
import {render} from 'react-dom';
import {NavigationHandler} from 'navigation-react';
import {MobileHistoryManager, Scene} from 'navigation-react-mobile';
import createStateNavigator from './createStateNavigator';
import Zoom from './Zoom';

const stateNavigator = createStateNavigator();

stateNavigator
  .configure(stateNavigator, new MobileHistoryManager(url => {
    var {state, data} = stateNavigator.parseLink(url);
    return stateNavigator.fluent()
      .navigate('grid')
      .navigate(state.key, data).url;
  }));

stateNavigator.start();

const App = ({crumb}) => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <Scene crumb={crumb} />
  </NavigationHandler>
);

render(
  <NavigationHandler stateNavigator={stateNavigator}>
    <Zoom app={App} />
  </NavigationHandler>,
  document.getElementById('content')
)
