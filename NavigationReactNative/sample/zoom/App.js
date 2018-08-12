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

var openLink = url => {
  if (url) {
    var link = stateNavigator.fluent(true)
      .navigate('detail', {color: 'blue'})
      .navigate('detail', {color: 'green'})
    .url;
    stateNavigator.navigateLink(link);
  }
};

Linking.getInitialURL().then(openLink);
Linking.addEventListener('url', openLink);

export default ({crumb}) => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <Scene crumb={crumb} />
  </NavigationHandler>
);
