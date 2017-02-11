import React from 'react';
import {StateNavigator} from 'navigation';
import Grid from './Grid';
import Detail from './Detail';

export default () => {
  const stateNavigator = new StateNavigator([
    {key: 'grid'},
    {key: 'detail', trackCrumbTrail: true},
  ]);

  const { grid, detail } = stateNavigator.states;
  grid.renderScene = data => <Grid stateNavigator={stateNavigator}/>;
  detail.renderScene = data => <Detail {...data} stateNavigator={stateNavigator}/>;
  
  return stateNavigator;
}
