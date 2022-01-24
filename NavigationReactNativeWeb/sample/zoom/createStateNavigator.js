import React from 'react';
import {Platform} from 'react-native';
import {StateNavigator} from 'navigation';
import {NavigationStack} from 'navigation-react-native';
import Grid from './Grid';
import Detail from './Detail';

const colors = [
  'maroon', 'red', 'crimson', 'orange', 'brown', 'sienna', 'olive',
  'purple', 'fuchsia', 'indigo', 'green', 'navy', 'blue', 'teal', 'black'
];

export default () => {
  const stateNavigator = new StateNavigator([
    {key: 'grid', route: ''},
    {key: 'detail', route: '{color}', trackCrumbTrail: true},
  ], NavigationStack.HistoryManager && new NavigationStack.HistoryManager(url => {
    const {state, data} = stateNavigator.parseLink(url);
    return stateNavigator.fluent()
      .navigate('grid')
      .navigate(state.key, data).url;
  }));

  const {grid, detail} = stateNavigator.states;
  grid.renderScene = () => <Grid colors={colors} />;
  detail.renderScene = ({color}) => <Detail colors={colors} color={color} />;
  
  if (Platform.OS === 'web') stateNavigator.start()
  else stateNavigator.navigate('grid');
  
  return stateNavigator;
}
