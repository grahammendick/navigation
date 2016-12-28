import React from 'react';
import { Dimensions, AppRegistry, StyleSheet, View } from 'react-native';
import { SceneNavigator, spring } from 'navigation-react-native';
import createStateNavigator from './createStateNavigator';

const stateNavigator = createStateNavigator();

const getStyle = (translate, scale, opacity) => ({
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
            pointerEvents={active ? 'auto' : 'none'}
            dimensions={Dimensions.get('window')}>
            {scene}
          </Scene>
      )}
    </SceneNavigator>
  </View>
);

const Scene = ({ translate, scale, opacity, pointerEvents,
  dimensions: { width, height }, children }) => (
  <View
    pointerEvents={pointerEvents}
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
    backgroundColor: 'white',
    position: 'absolute',
  }
});

AppRegistry.registerComponent('twitter', () => Twitter);
