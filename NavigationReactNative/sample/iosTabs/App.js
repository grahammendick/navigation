/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import {addNavigateHandler} from './NavigationMotion.js';
import Scene from './Scene.js';
import Page from './Page.js';

var stateNavigatorZero = new StateNavigator([
  {key: 'scene', trackCrumbTrail: true, title: 'Scene'},
]);
var {scene} = stateNavigatorZero.states;
scene.renderScene = (_data, props) => <Page {...props} />;
stateNavigatorZero.navigate('scene');

var stateNavigatorOne = new StateNavigator(stateNavigatorZero);
stateNavigatorOne.navigate('scene');

var stateNavigators = [stateNavigatorZero, stateNavigatorOne];
stateNavigators.forEach(addNavigateHandler);

export default ({crumb, tab}) => (
  <NavigationHandler stateNavigator={stateNavigators[tab]}>
    <Scene crumb={crumb} tab={tab} changeTabs={() => {
      stateNavigators[-1 * (tab -1)].navigate('scene');
    }} />
  </NavigationHandler>
);
