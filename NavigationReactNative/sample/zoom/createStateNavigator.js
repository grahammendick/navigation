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
  grid.renderScene = (data, moveScene) => <Grid moveScene={moveScene} stateNavigator={stateNavigator}/>;
  detail.renderScene = (data, moveScene, previousSceneData) => {
    var colorRef = previousSceneData.colors[data.color];
    return <Detail {...data} colorRef={colorRef} moveScene={moveScene} stateNavigator={stateNavigator}/>;
  }
  
  return stateNavigator;
}
