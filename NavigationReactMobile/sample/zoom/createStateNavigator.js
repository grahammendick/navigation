import React from 'react';
import {StateNavigator} from 'navigation';
import {MobileHistoryManager} from 'navigation-react-mobile';
import Grid from './Grid';
import Detail from './Detail';

export default () => {
  const stateNavigator = new StateNavigator([
    {key: 'grid'},
    {key: 'detail', trackCrumbTrail: true},
  ], new MobileHistoryManager('', true));

  const { grid, detail } = stateNavigator.states;
  grid.renderScene = data => <Grid stateNavigator={stateNavigator}/>;
  detail.renderScene = data => <Detail {...data} stateNavigator={stateNavigator}/>;
  
  return stateNavigator;
}
