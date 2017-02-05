import React from 'react';
import {StateNavigator} from 'navigation';
import Scene from './Scene';

export default () => {
  const stateNavigator = new StateNavigator([
    {key: 'scene', trackCrumbTrail: true},
  ]);

  const { scene } = stateNavigator.states;
  scene.renderScene = (data, asyncData, moveScene) => <Scene moveScene={moveScene} stateNavigator={stateNavigator}/>;
  
  return stateNavigator;
}
