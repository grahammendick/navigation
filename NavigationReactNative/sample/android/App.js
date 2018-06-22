/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import Scene from './Scene.js';
import Page from './Page.js';

var stateNavigator = new StateNavigator([
  {key: 'scene', trackCrumbTrail: true},
]);
var {scene} = stateNavigator.states;
scene.renderScene = () => <Page />;
stateNavigator.navigate('scene');

export default class App extends Component {
  render() {
    return (
      <NavigationHandler stateNavigator={stateNavigator}>
        <Scene crumb={this.props.crumb} />
      </NavigationHandler>
    );
  }
}
