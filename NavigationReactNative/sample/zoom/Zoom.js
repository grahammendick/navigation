import React from 'react';
import {Dimensions, View} from 'react-native';
import {NavigationMotion, spring} from 'navigation-react-native';

export default ({stateNavigator}) => (
  <NavigationMotion
    startStateKey="grid"
    unmountedStyle={{show: spring(0)}}
    mountedStyle={{show: spring(1)}}
    crumbStyle={{show: spring(1)}}
    style={{flex: 1}}
    stateNavigator={stateNavigator}>
    {({show}, scene) => (
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          opacity: Math.floor(show),
        }}>
        {scene}
      </View>
    )}
  </NavigationMotion>
);
