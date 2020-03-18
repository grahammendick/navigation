import React from 'react';
import {View} from 'react-native';
import {NavigationMotion} from 'navigation-react-mobile';

export default () => (
  <NavigationMotion
    unmountedStyle={{translate: 100, scale: 1, opacity: 1}}
    mountedStyle={{translate: 0, scale: 1, opacity: 1}}
    crumbStyle={{translate: 5, scale: 0.9, opacity: 0}}>
    {({translate, scale, opacity}, scene, key) => (
      <View key={key}
        style={{
          transform: `translate(${translate}%) scale(${scale}, ${scale})`,
          opacity,
          position: 'fixed',
          left: 0, right: 0, top: 0, bottom: 0,
          overflow: 'auto',
          justifyContent: 'center'
        }}>
        {scene}
      </View>
    )}
  </NavigationMotion>
);
