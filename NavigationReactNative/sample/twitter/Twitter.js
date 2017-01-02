import React from 'react';
import {Dimensions, View} from 'react-native';
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
      <View
        pointerEvents={active ? 'auto' : 'none'}
        style={{
          position: 'absolute',
          backgroundColor: 'white',
          left: 0,
          right: 0,
          top: visible ? 0 : -999999,
          bottom: visible ? 0 : 999999,
          opacity: opacity,
          transform: [
            {translateX: Dimensions.get('window').width * translate},
            {scale: scale},
          ]
        }}>
        {scene}
      </View>
    )}
  </SceneNavigator>
);
