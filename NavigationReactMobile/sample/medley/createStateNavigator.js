import React from 'react';
import {StateNavigator} from 'navigation';
import {MobileHistoryManager} from 'navigation-react-mobile';
import Scene from './Scene';

export default () => {
  const states = [
    {key: 'sceneNorth', route: '', trackCrumbTrail: true},
    {key: 'sceneEast', trackCrumbTrail: true},
    {key: 'sceneSouth', trackCrumbTrail: true},
    {key: 'sceneWest', trackCrumbTrail: true},
  ];
  const stateNavigator = new StateNavigator(states, new MobileHistoryManager(url => {
    var {state} = stateNavigator.parseLink(url);
    var fluentNavigator = stateNavigator.fluent();
    for(var i = 0; i < states.length && states[i].key !== state.key; i++)
      fluentNavigator = fluentNavigator.navigate(states[i].key);
    return fluentNavigator.navigate(state.key).url;
  }));

  const { sceneNorth, sceneEast, sceneSouth, sceneWest } = stateNavigator.states;
  sceneNorth.renderScene = () => renderScene('North', 'blue', stateNavigator);
  sceneEast.renderScene = () => renderScene('East', 'red', stateNavigator);
  sceneSouth.renderScene = () => renderScene('South', 'green', stateNavigator);
  sceneWest.renderScene = () => renderScene('West', 'black', stateNavigator);

  const renderScene = (direction, color, stateNavigator) => (
    <Scene
      direction={direction}
      color={color}
      index={stateNavigator.stateContext.crumbs.length}
      stateNavigator={stateNavigator}/>
  )

  sceneNorth.unmountedStyle = {translateY: -1};
  sceneEast.unmountedStyle = {translateX: 1};
  sceneSouth.unmountedStyle = {translateY: 1};
  sceneWest.unmountedStyle = {translateX: -1};

  sceneNorth.mountedStyle = {translateY: 0};
  sceneEast.mountedStyle = {translateX: 0};
  sceneSouth.mountedStyle = {translateY: 0};
  sceneWest.mountedStyle = {translateX: 0};

  sceneNorth.crumbStyle = {translateY: -.3};
  sceneEast.crumbStyle = {translateX: .3};
  sceneSouth.crumbStyle = {translateY: .3};
  sceneWest.crumbStyle = {translateX: -.3};
  
  return stateNavigator;
}
