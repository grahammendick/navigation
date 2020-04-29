import React from 'react';
import {StateNavigator} from 'navigation';
import {MobileHistoryManager} from 'navigation-react-mobile';
import Grid from './Grid';
import Detail from './Detail';

export default () => {
  const buildStartUrl = url => {
    const {state, data} = stateNavigator.parseLink(url);
    return stateNavigator.fluent()
      .navigate('grid')
      .navigate(state.key, data).url;
  };

  const stateNavigator = new StateNavigator([
    {key: 'grid', route: ''},
    {key: 'detail', trackCrumbTrail: true},
  ], new MobileHistoryManager(buildStartUrl));

  const {grid, detail} = stateNavigator.states;
  grid.renderScene = data => <Grid />;
  detail.renderScene = data => <Detail {...data} />;
  
  return stateNavigator;
}
