/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import Scene from './Scene.js';
import Page from './Page.js';

var stateNavigator = new StateNavigator([
  {key: 'scene', trackCrumbTrail: true, title: 'Scene'},
]);
var {scene} = stateNavigator.states;
scene.renderScene = () => <Page />;
stateNavigator.navigate('scene');

var stateNavigatorTwo = new StateNavigator(stateNavigator);
stateNavigatorTwo.navigate('scene');

var stateNavigators = [stateNavigator, stateNavigatorTwo];

export default ({crumb, tab}) => (
  <NavigationHandler stateNavigator={stateNavigators[tab]}>
    <Scene crumb={crumb} tab={tab} />
  </NavigationHandler>
);
