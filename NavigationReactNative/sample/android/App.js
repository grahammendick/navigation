/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {Text} from 'react-native';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import Scene from './Scene.js';

var stateNavigator = new StateNavigator([
  {key: 'scene1'},
  {key: 'scene2'},
]);
var {scene1} = stateNavigator.states;
scene1.renderScene = () => <Text>Scene One</Text>;
stateNavigator.navigate('scene1');

export default class App extends Component {
  render() {
    return (
      <NavigationHandler stateNavigator={stateNavigator}>
        <Scene />
      </NavigationHandler>
    );
  }
}

/*const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});*/
