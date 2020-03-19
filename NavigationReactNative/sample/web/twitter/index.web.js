import React from 'react';
import {render} from 'react-dom';
import {NavigationHandler} from 'navigation-react';
import {MobileHistoryManager} from 'navigation-react-mobile';
import createStateNavigator from './createStateNavigator';
import Twitter from './Twitter';

const stateNavigator = createStateNavigator();

const buildStartUrl = url => {
  const {state, data} = stateNavigator.parseLink(url);
  let fluent = stateNavigator.fluent().navigate('home');
  stateNavigator.historyManager.addHistory(fluent.url, true);
  return fluent.navigate(state.key, data).url;
};

stateNavigator.configure(stateNavigator, new MobileHistoryManager(buildStartUrl));

stateNavigator.start();

render(
  <NavigationHandler stateNavigator={stateNavigator}>
    <Twitter />
  </NavigationHandler>,
  document.getElementById('content')
)
