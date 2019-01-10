import React from 'react';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import {addNavigateHandlers, Scene} from 'navigation-react-native';
import {Linking} from 'react-native';
import Grid from './Grid';
import Detail from './Detail';

var stateNavigator = new StateNavigator([
  {key: 'grid', title: 'Colors'},
  {key: 'detail', title: 'Color', trackCrumbTrail: true},
]);

const { grid, detail } = stateNavigator.states;
grid.renderScene = () => <Grid/>;
detail.renderScene = ({color}) => <Detail color={color}/>;

stateNavigator.navigate('grid');
addNavigateHandlers(stateNavigator);

detail.truncateCrumbTrail = (state, data, crumbs) => (
  crumbs.slice(-1)[0].state === detail ? crumbs.slice(0, -1) : crumbs
);

var openLink = (url) => {
  if (url) {
    var color = url.split('=')[1];
    stateNavigator.navigate('detail', {color});
  }
};

Linking.getInitialURL().then(openLink);
Linking.addEventListener('url', ({url}) => openLink(url));

export default ({crumb}) => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <Scene crumb={crumb} />
  </NavigationHandler>
);
