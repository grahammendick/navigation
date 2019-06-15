import React from 'react';
import {render} from 'react-dom';
import {NavigationHandler} from 'navigation-react';
import {MobileHistoryManager} from 'navigation-react-mobile';
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

render(
  <NavigationHandler stateNavigator={stateNavigator}>
    <Zoom />
  </NavigationHandler>,
  document.getElementById('content')
)
