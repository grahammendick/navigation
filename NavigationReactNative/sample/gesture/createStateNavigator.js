import React from 'react';
import {StateNavigator} from 'navigation';
import Scene from './Scene';

export default () => {
  const stateNavigator = new StateNavigator([
    {key: 'sceneOne'},
    {key: 'sceneTwo', trackCrumbTrail: true},
  ]);

  const { sceneOne, sceneTwo } = stateNavigator.states;
  sceneOne.renderScene = () => <Scene name="One" stateNavigator={stateNavigator}/>;
  sceneTwo.renderScene = () => <Scene name="Two" stateNavigator={stateNavigator}/>;
  
  return stateNavigator;
}
