/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import {addNavigateHandlers, NavigationMotion} from 'navigation-react-native';
import Page from './Page.js';

var stateNavigatorZero = new StateNavigator([
  {key: 'scene', trackCrumbTrail: true, title: 'Scene'},
]);
var {scene} = stateNavigatorZero.states;
scene.renderScene = () => <Page />;
stateNavigatorZero.navigate('scene');

var stateNavigatorOne = new StateNavigator(stateNavigatorZero);
stateNavigatorOne.navigate('scene');

var stateNavigators = [stateNavigatorZero, stateNavigatorOne];
addNavigateHandlers(stateNavigators);

export default ({crumb, tab}) => (
  <NavigationHandler stateNavigator={stateNavigators[tab]}>
    <NavigationMotion crumb={crumb} tab={tab} />
  </NavigationHandler>
);
