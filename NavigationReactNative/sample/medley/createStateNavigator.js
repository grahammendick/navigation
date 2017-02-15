import React from 'react';
import {StateNavigator} from 'navigation';
import Scene from './Scene';

export default () => {
  const stateNavigator = new StateNavigator([
    {key: 'sceneNorth', trackCrumbTrail: true},
    {key: 'sceneEast', trackCrumbTrail: true},
    {key: 'sceneSouth', trackCrumbTrail: true},
    {key: 'sceneWest', trackCrumbTrail: true},
  ]);

  const { sceneNorth, sceneEast, sceneSouth, sceneWest } = stateNavigator.states;
  sceneNorth.renderScene = (data, moveScene) => <Scene direction="north" stateNavigator={stateNavigator}/>;
  sceneEast.renderScene = (data, moveScene) => <Scene direction="east" stateNavigator={stateNavigator}/>;
  sceneSouth.renderScene = (data, moveScene) => <Scene direction="south" stateNavigator={stateNavigator}/>;
  sceneWest.renderScene = (data, moveScene) => <Scene direction="west" stateNavigator={stateNavigator}/>;

  sceneNorth.unmountedStyle = () => ({translateX: spring(0), translateY: spring(1)});
  sceneEast.unmountedStyle = () => ({translateX: spring(1), translateY: spring(0)});
  sceneSouth.unmountedStyle = () => ({translateX: spring(0), translateY: spring(-1)});
  sceneWest.unmountedStyle = () => ({translateX: spring(-1), translateY: spring(0)});
  
  return stateNavigator;
}
