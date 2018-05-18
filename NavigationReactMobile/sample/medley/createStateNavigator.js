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
  sceneNorth.renderScene = () => renderScene('North', 'blue');
  sceneEast.renderScene = () => renderScene('East', 'red');
  sceneSouth.renderScene = () => renderScene('South', 'green');
  sceneWest.renderScene = () => renderScene('West', 'black');

  const renderScene = (direction, color) => (
    <Scene direction={direction} color={color} />
  )

  sceneNorth.unmountedStyle = {translateY: -100};
  sceneEast.unmountedStyle = {translateX: 100};
  sceneSouth.unmountedStyle = {translateY: 100};
  sceneWest.unmountedStyle = {translateX: -100};

  sceneNorth.mountedStyle = {translateY: 0};
  sceneEast.mountedStyle = {translateX: 0};
  sceneSouth.mountedStyle = {translateY: 0};
  sceneWest.mountedStyle = {translateX: 0};

  sceneNorth.crumbStyle = {translateY: -30};
  sceneEast.crumbStyle = {translateX: 30};
  sceneSouth.crumbStyle = {translateY: 30};
  sceneWest.crumbStyle = {translateX: -30};
  
  return stateNavigator;
}
