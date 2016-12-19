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

const stateNavigator = new StateNavigator([
  { key: 'home' },
  { key: 'tweet', trackCrumbTrail: true }
]);

var { home, tweet } = stateNavigator.states;
home.renderScene = () => <Text style={styles.welcome}>Welcome</Text>;
//tweet.renderScene = ({id}) => <Tweet tweet={getTweet(id)} stateNavigator={stateNavigator}/>;

tweet.truncateCrumbTrail = (state, crumbs) => crumbs;

export default class Twitter extends Component {
  componentDidMount() {
    stateNavigator.start('home');
  }
  render() {
    return (
        <SceneNavigator
          unmountedStyle={{translate: spring(100), scale: spring(1)}}
          mountedStyle={{translate: spring(0), scale: spring(1)}}
          crumbStyle={{translate: spring(5), scale: spring(0.9)}}
          stateNavigator={stateNavigator}>
              {({translate, scale}, scene) => <View>{scene}</View>}
      </SceneNavigator>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 50,
    textAlign: 'center',
    margin: 10,
  },
});

AppRegistry.registerComponent('twitter', () => Twitter);
