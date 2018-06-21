/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import Scene from './Scene.js';

var stateNavigator = new StateNavigator([
  {key: 'scene1'},
  {key: 'scene2'},
]);
var {scene1} = stateNavigator.states;

scene1.renderScene = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Scene One</Text>
  </View>
);
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
