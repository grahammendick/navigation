import React from 'react';
import {View} from 'react-native';
import {NavigationMotion} from 'navigation-react-native';
import ZoomShared from './ZoomShared';

export default ({stateNavigator}) => (
  <NavigationMotion
    startStateKey="list"
    unmountedStyle={{opacity: 0}}
    mountedStyle={{opacity: 1}}
    crumbStyle={{opacity: 0}}
    style={{flex: 1}}
    sharedElementMotion={props => <ZoomShared {...props} />}
    duration={500}
    stateNavigator={stateNavigator}>
    {({opacity}, scene, url) => (
      <View key={url}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          opacity
        }}>
        {scene}
      </View>
    )}
  </NavigationMotion>
);
