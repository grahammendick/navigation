/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { StateNavigator } from 'navigation';
import { SceneNavigator, spring } from 'navigation-react-native';
import Home from './Home';
import Tweet from './Tweet';

const stateNavigator = new StateNavigator([
  { key: 'home' },
  { key: 'tweet', trackCrumbTrail: true }
]);

var { home, tweet } = stateNavigator.states;
home.renderScene = () => <Home stateNavigator={stateNavigator} />;
tweet.renderScene = () => <Tweet stateNavigator={stateNavigator}/>;

tweet.truncateCrumbTrail = (state, crumbs) => crumbs;

export default class Twitter extends Component {
  componentDidMount() {
    stateNavigator.start('home');
  }
  render() {
    return (
      <View style={styles.container}>
          <SceneNavigator
            unmountedStyle={{translate: spring(100), scale: spring(1)}}
            mountedStyle={{translate: spring(0), scale: spring(1)}}
            crumbStyle={{translate: spring(5), scale: spring(0.9)}}
            stateNavigator={stateNavigator}>
                {({translate, scale}, scene) => <View>{scene}</View>}
        </SceneNavigator>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

AppRegistry.registerComponent('twitter', () => Twitter);
