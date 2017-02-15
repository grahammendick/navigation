import React from 'react';
import {Dimensions, View} from 'react-native';
import {NavigationMotion, spring} from 'navigation-react-native';

export default ({stateNavigator}) => (
  <NavigationMotion
    startStateKey="sceneNorth"
    unmountedStyle={state => state.unmountedStyle()}
    mountedStyle={{translateX: spring(0, {stiffness: 30}), translateY: spring(0, {stiffness: 30})}}
    crumbStyle={{translateX: spring(0, {stiffness: 30}), translateY: spring(0, {stiffness: 30})}}
    style={{flex: 1}}
    stateNavigator={stateNavigator}>
    {({translateX, translateY}, scene) => (
      <View
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
