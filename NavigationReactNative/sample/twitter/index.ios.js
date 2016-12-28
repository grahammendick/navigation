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

var getStyle = (translate, scale, opacity) => ({
  translate: spring(translate),
  scale: spring(scale),
  opacity: spring(opacity)
});

export default Twitter = () => (
  <View>
    <SceneNavigator
      startStateKey="home"
      unmountedStyle={getStyle(1, 1, 1)}
      mountedStyle={getStyle(0, 1, 1)}
      crumbStyle={getStyle(0.05, 0.9, 0)}
      stateNavigator={stateNavigator}>
      {({translate, scale, opacity}, scene, active) => (
          <Scene
            scale={scale}
            translate={translate}
            opacity={opacity}
            active={active}
            dimensions={Dimensions.get('window')}>
            {scene}
          </Scene>
      )}
    </SceneNavigator>
  </View>
);

var Scene = ({ translate, scale, opacity, active,
  dimensions: { width, height }, children }) => (
  <View
    pointerEvents={active ? 'auto' : 'none'}
    style={[
      styles.scene,
      { width: width,
        height: height,
        opacity: opacity,
        transform: [
          { translateX: width * translate },
          { scale: scale },
        ]
      }
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
