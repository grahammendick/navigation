import React from 'react';
import {View} from 'react-native';
import {NavigationMotion} from 'navigation-react-native';
import ZoomShared from './ZoomShared';

export default ({stateNavigator}) => (
  <NavigationMotion
    startStateKey="grid"
    unmountedStyle={{opacity: 0}}
    mountedStyle={{opacity: 1}}
    crumbStyle={{opacity: .9}}
    style={{flex: 1}}
    sharedElementMotion={() => <ZoomShared stateNavigator={stateNavigator} />}
    stateNavigator={stateNavigator}>
    {({opacity}, scene, url) => (
      <View key={url}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          opacity: opacity === 1 ? opacity : opacity / 2
        }}>
        {scene}
      </View>
    )}
  </NavigationMotion>
);
