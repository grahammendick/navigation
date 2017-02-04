import React from 'react';
import {Dimensions, View} from 'react-native';
import {SceneNavigator, spring} from 'navigation-react-native';

export default ({stateNavigator}) => (
  <SceneNavigator
    startStateKey="home"
    unmountedStyle={{translate: spring(1)}}
    mountedStyle={{translate: spring(0)}}
    crumbStyle={{translate: spring(0)}}
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
          ]
        }}>
        {scene}
      </View>
    )}
  </SceneNavigator>
);
