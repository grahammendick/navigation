import React from 'react';
import {View} from 'react-native';
import {NavigationMotion} from 'navigation-react-mobile';
import ZoomShared from './ZoomShared';

export default () => (
  <NavigationMotion
    unmountedStyle={{opacity: 0}}
    mountedStyle={{opacity: 1}}
    crumbStyle={{opacity: 0}}
    sharedElementMotion={props => <ZoomShared {...props} />}>
    {({opacity}, scene, key) => (
      <View key={key}
        style={{
          opacity,
          position: 'fixed',
          left: 0, right: 0, top: 0, bottom: 0,
          overflow: 'auto',
          padding: 5,
          justifyContent: 'center'
        }}>
        {scene}
      </View>
    )}
  </NavigationMotion>
);
