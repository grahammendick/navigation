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
  {key: 'scene1'},
  {key: 'scene2', trackCrumbTrail: true},
]);
var {scene1, scene2} = stateNavigator.states;
scene1.renderScene = () => <Page />;
scene2.renderScene = () => <Page />;
stateNavigator.navigate('scene1');

export default class App extends Component {
  render() {
    return (
      <NavigationHandler stateNavigator={stateNavigator}>
        <Scene crumb={this.props.crumb} />
      </NavigationHandler>
    );
  }
}
