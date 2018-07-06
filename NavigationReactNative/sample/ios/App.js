/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import {addNavigateHandlers, Scene} from 'navigation-react-native';
import Page from './Page.js';

var stateNavigator = new StateNavigator([
  {key: 'scene', trackCrumbTrail: true, title: 'Scene'},
]);
var {scene} = stateNavigator.states;
scene.renderScene = () => <Page />;
stateNavigator.navigate('scene');

addNavigateHandlers(stateNavigator);

export default ({crumb}) => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <Scene crumb={crumb} />
  </NavigationHandler>
);
