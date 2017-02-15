import React from 'react';
import {Dimensions, View} from 'react-native';
import {NavigationMotion, spring} from 'navigation-react-native';

export default ({stateNavigator}) => (
  <NavigationMotion
    startStateKey="sceneNorth"
    unmountedStyle={state => state.unmountedStyle()}
    mountedStyle={{translateX: spring(0), translateY: spring(0)}}
    crumbStyle={{translateX: spring(0), translateY: spring(0)}}
    style={{flex: 1}}
    stateNavigator={stateNavigator}>
    {({translate}, scene) => (
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          transform: [
            {translateX: Dimensions.get('window').width * translate},
            {translateY: Dimensions.get('window').height * translate},
          ]
        }}>
        {scene}
      </View>
    )}
  </NavigationMotion>
);
