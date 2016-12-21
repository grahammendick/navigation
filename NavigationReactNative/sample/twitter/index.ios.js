/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Dimensions,
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
tweet.renderScene = () => <Tweet stateNavigator={stateNavigator} />;

tweet.truncateCrumbTrail = (state, crumbs) => crumbs;

export default class Twitter extends Component {
  componentDidMount() {
    stateNavigator.navigate('home');
  }
  render() {
    return (
      <View>
        <SceneNavigator
          unmountedStyle={{ translate: spring(100), scale: spring(1) }}
          mountedStyle={{ translate: spring(0), scale: spring(1) }}
          crumbStyle={{ translate: spring(5), scale: spring(0.9) }}
          stateNavigator={stateNavigator}>
          {({translate, scale}, scene) => <View style={[
            styles.scene,
            {
              transform: [
                { translateX: Dimensions.get('window').width * translate / 100 },
                { scale: scale },
              ]
            },
          ]}>{scene}</View>}
        </SceneNavigator>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scene: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
  }
});

AppRegistry.registerComponent('twitter', () => Twitter);
