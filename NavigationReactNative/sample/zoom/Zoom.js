import React from 'react';
import {View} from 'react-native';
import spring from './spring';
import NavigationMotion from './NavigationMotion';
import ZoomMotion from './ZoomMotion';

export default ({stateNavigator}) => (
  <NavigationMotion
    startStateKey="grid"
    unmountedStyle={{opacity: spring(0)}}
    mountedStyle={{opacity: spring(1)}}
    crumbStyle={{opacity: spring(0)}}
    style={{flex: 1}}
    stateNavigator={stateNavigator}>
    {({opacity}, scene, url) => (
      <View key={url}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}>
        <View style={{opacity: opacity, flex: 1}}>
          {scene}
        </View>
        <ZoomMotion stateNavigator={stateNavigator} />
      </View>
    )}
  </NavigationMotion>
);
