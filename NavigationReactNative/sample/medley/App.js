import React from 'react';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import {NavigationStack} from 'navigation-react-native';
import Direction from './Direction';

const stateNavigator = new StateNavigator([
  {key: 'north', title: 'North', trackCrumbTrail: true},
  {key: 'east', title: 'East', trackCrumbTrail: true},
  {key: 'south', title: 'South', trackCrumbTrail: true},
  {key: 'west', title: 'West', trackCrumbTrail: true},
]);

const { north, east, south, west } = stateNavigator.states;
north.renderScene = () => <Direction direction="north" color="blue" />;
east.renderScene = () => <Direction direction="east" color="red" />;
south.renderScene = () => <Direction direction="south" color="green" />;
west.renderScene = () => <Direction direction="west" color="black" />;

north.getCrumbStyle = from => from ? 'north_crumb_in' : 'north_crumb_out';
north.getUnmountStyle = from => from ? 'north_in' : 'north_out';
east.getCrumbStyle = from => from ? 'east_crumb_in' : 'east_crumb_out';
east.getUnmountStyle = from => from ? 'east_in' : 'east_out';
south.getCrumbStyle = from => from ? 'south_crumb_in' : 'south_crumb_out';
south.getUnmountStyle = from => from ? 'south_in' : 'south_out';
west.getCrumbStyle = from => from ? 'west_crumb_in' : 'west_crumb_out';
west.getUnmountStyle = from => from ? 'west_in' : 'west_out';

stateNavigator.navigate('north');

export default () => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <NavigationStack
      crumbStyle={(from, state) => state.getCrumbStyle(from)}
      unmountStyle={(from, state) => state.getUnmountStyle(from)} />
  </NavigationHandler>
);
