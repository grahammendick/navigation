import React, { Component } from 'react';
import { Dimensions, AppRegistry, StyleSheet, Text, View } from 'react-native';
import { StateNavigator } from 'navigation';
import { SceneNavigator, spring } from 'navigation-react-native';
import Home from './Home';
import Tweet from './Tweet';
import { getHome } from './data';

const stateNavigator = new StateNavigator([
  { key: 'home' },
  { key: 'tweet', trackCrumbTrail: true }
]);

var { home, tweet } = stateNavigator.states;
home.renderScene = () => <Home tweets={getHome()} stateNavigator={stateNavigator}/>;
tweet.renderScene = () => <Tweet stateNavigator={stateNavigator} />;

tweet.truncateCrumbTrail = (state, crumbs) => crumbs;

export default Twitter = () => (
  <View>
    <SceneNavigator
      startStateKey="home"
      unmountedStyle={{ translate: spring(1), scale: spring(1) }}
      mountedStyle={{ translate: spring(0), scale: spring(1) }}
      crumbStyle={{ translate: spring(0.05), scale: spring(0.9) }}
      stateNavigator={stateNavigator}>
      {({translate, scale}, scene, active) => (
          <Scene
            scale={scale}
            translate={translate}
            active={active}
            dimensions={Dimensions.get('window')}>
            {scene}
          </Scene>
      )}
    </SceneNavigator>
  </View>
);

var Scene = ({ translate, scale, active,
  dimensions: { width, height }, children }) => (
  <View
    pointerEvents={active ? 'auto' : 'none'}
    style={[
      styles.scene,
      { width: width, height: height },
      { transform: [
          { translateX: width * translate },
          { scale: scale },
        ]
      },
    ]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  scene: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    position: 'absolute',
  }
});

AppRegistry.registerComponent('twitter', () => Twitter);
