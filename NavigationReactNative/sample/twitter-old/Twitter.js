import React from 'react';
import {Dimensions, View} from 'react-native';
import {NavigationMotion} from 'navigation-react-native';

export default ({stateNavigator, startStateKey, visible}) => (
  <NavigationMotion
    startStateKey={startStateKey}
    unmountedStyle={{translate: 1, scale: 1, opacity: 1}}
    mountedStyle={{translate: 0, scale: 1, opacity: 1}}
    crumbStyle={{translate: 0.05, scale: 0.9, opacity: 0}}
    style={{flex: +visible, backgroundColor: 'black'}}
    stateNavigator={stateNavigator}>
    {({translate, scale, opacity}, scene, url) => (
      <View
        key={url}
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
  </NavigationMotion>
);
