import React from 'react';
import {Dimensions, View} from 'react-native';
import {NavigationMotion, spring} from 'navigation-react-native';

export default ({stateNavigator}) => (
  <NavigationMotion
    startStateKey="grid"
    style={{flex: 1}}
    stateNavigator={stateNavigator}>
    {(style, scene) => (
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}>
        {scene}
      </View>
    )}
  </NavigationMotion>
);
