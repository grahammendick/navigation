import React from 'react';
import {StateNavigator} from 'navigation';
import {MobileHistoryManager} from 'navigation-react-mobile';
import Scene from './Scene';

export default () => {
  const stateNavigator = new StateNavigator([
    {key: 'sceneNorth', route: '', trackCrumbTrail: true},
    {key: 'sceneEast', trackCrumbTrail: true},
    {key: 'sceneSouth', trackCrumbTrail: true},
    {key: 'sceneWest', trackCrumbTrail: true},
  ], new MobileHistoryManager(url => {
    var {state} = stateNavigator.parseLink(url);
    const fluentNavigator = stateNavigator.fluent();
    for(var i = 0; i < stateNavigator.states.length; i++){
      var stateKey = stateNavigator.states[i].key;
      if (stateKey !== state.key)
        fluentNavigator.navigate(stateKey);
    }
    return fluentNavigator .navigate(state.key).url;
  }));

  const { sceneNorth, sceneEast, sceneSouth, sceneWest } = stateNavigator.states;
  sceneNorth.renderScene = () => <Scene direction="North" color="blue" stateNavigator={stateNavigator}/>;
  sceneEast.renderScene = () => <Scene direction="East" color="red" stateNavigator={stateNavigator}/>;
  sceneSouth.renderScene = () => <Scene direction="South" color="green" stateNavigator={stateNavigator}/>;
  sceneWest.renderScene = () => <Scene direction="West" color="black" stateNavigator={stateNavigator}/>;

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

  sceneNorth.duration = 500;
  sceneEast.duration = 1000;
  sceneSouth.duration = 2000;
  sceneWest.duration = 4000;

  sceneNorth.easing = 'easeLinear';
  sceneEast.easing = 'easeExpIn';
  sceneSouth.easing = 'easeExpOut';
  sceneWest.easing = 'easeExpInOut';
  
  return stateNavigator;
}
