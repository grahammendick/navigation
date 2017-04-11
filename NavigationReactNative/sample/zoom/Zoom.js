import React from 'react';
import {View} from 'react-native';
import NavigationMotion from './NavigationMotion';
import ZoomMotion from './ZoomMotion';

export default ({stateNavigator}) => (
  <NavigationMotion
    startStateKey="grid"
    unmountedStyle={{}}
    mountedStyle={{}}
    crumbStyle={{}}
    style={{flex: 1}}
    stateNavigator={stateNavigator}>
    {(style, scene, url) => (
      <View key={url}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}>
        <View          
          style={{
            flex: 1,
          }}>
          {scene}
        </View>
        <ZoomMotion stateNavigator={stateNavigator} />
      </View>
    )}
  </NavigationMotion>
);
