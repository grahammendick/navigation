import React from 'react';
import {Dimensions, View} from 'react-native';
import {NavigationMotion} from 'navigation-react-native';

export default ({stateNavigator}) => (
  <NavigationMotion
    startStateKey="sceneNorth"
    unmountedStyle={state => state.unmountedStyle()}
    mountedStyle={state => state.mountedStyle()}
    crumbStyle={state => state.crumbStyle()}
    style={{flex: 1}}
    stateNavigator={stateNavigator}>
    {({translateX  = 0, translateY = 0}, scene, url) => (
      <View
        key={url}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          transform: [
            {translateX: Dimensions.get('window').width * translateX},
            {translateY: Dimensions.get('window').height * translateY},
          ]
        }}>
        {scene}
      </View>
    )}
  </NavigationMotion>
);
