import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {SceneNavigator, spring} from 'navigation-react-native';

const getStyle = (translate, scale, opacity) => ({
  translate: spring(translate),
  scale: spring(scale),
  opacity: spring(opacity)
});

export default ({stateNavigator, startStateKey, visible, offset}) => (
  <SceneNavigator
    startStateKey={startStateKey}
    unmountedStyle={getStyle(1, 1, 1)}
    mountedStyle={getStyle(0, 1, 1)}
    crumbStyle={getStyle(0.05, 0.9, 0)}
    style={{flex: +visible, backgroundColor: 'black'}}
    stateNavigator={stateNavigator}>
    {({translate, scale, opacity}, scene, active) => (
        <Scene
          visible={visible}
          scale={scale}
          translate={translate}
          opacity={opacity}
          offset={offset}
          pointerEvents={active ? 'auto' : 'none'}
          dimensions={Dimensions.get('window')}>
          {scene}
        </Scene>
    )}
  </SceneNavigator>
);

const Scene = ({visible, translate, scale, opacity, pointerEvents,
  dimensions: {width, height}, offset, children}) => (
  <View
    pointerEvents={pointerEvents}
    style={[
      styles.scene,
      {
        top: visible ? 0 : -2*height,
        width: width,
        height: height -offset,
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

const styles = StyleSheet.create({
  scene: {
    backgroundColor: 'white',
    position: 'absolute',
  },
});
