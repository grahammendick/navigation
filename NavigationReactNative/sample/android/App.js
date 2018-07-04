/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import {NavigationMotion} from 'navigation-react-native';
import Page from './Page.js';

var stateNavigator = new StateNavigator([
  {key: 'scene', trackCrumbTrail: true},
]);
var {scene} = stateNavigator.states;
scene.renderScene = () => <Page />;
stateNavigator.navigate('scene');

export default ({crumb}) => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <NavigationMotion crumb={crumb} />
  </NavigationHandler>
);
