import React from 'react';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import {addNavigateHandlers, Scene} from 'navigation-react-native';
import Direction from './Direction';

const stateNavigator = new StateNavigator([
  {key: 'north', title: 'North', trackCrumbTrail: true},
  {key: 'east', title: 'East', trackCrumbTrail: true},
  {key: 'south', title: 'South', trackCrumbTrail: true},
  {key: 'west', title: 'West', trackCrumbTrail: true},
]);

const { north, east, south, west } = stateNavigator.states;
north.renderScene = () => <Direction direction="North" color="blue" />;
east.renderScene = () => <Direction direction="East" color="red" />;
south.renderScene = () => <Direction direction="South" color="green" />;
west.renderScene = () => <Direction direction="West" color="black" />;

stateNavigator.navigate('north');
addNavigateHandlers(stateNavigator);

export default ({crumb}) => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <Scene crumb={crumb} />
  </NavigationHandler>
);
