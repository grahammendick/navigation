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
  <View style={styles.app}>
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
    <Footer />
  </View>
);

const Scene = ({translate, scale, opacity, pointerEvents,
  dimensions: {width, height}, children}) => (
  <View
    pointerEvents={pointerEvents}
    style={[
      styles.scene,
      {
        width: width,
        height: height -70,
        opacity: opacity,
        transform: [
          {translateX: width * translate},
          {scale: scale},
        ]
      }
    ]}>
    {children}
  </View>
);

const Footer = () => (
  <View style={styles.footer}>
  </View>
);

const styles = StyleSheet.create({
  app: {
    flexDirection: 'row',
    flex: 1,
  },
  scene: {
    backgroundColor: 'white',
    position: 'absolute',
  },
  footer: {
    alignSelf: 'flex-end',
    flex: 1,
    height: 70,
    borderTopWidth: 2,
    borderColor: '#ccd6dd',
    backgroundColor: 'white',
  },
});

AppRegistry.registerComponent('twitter', () => Twitter);
