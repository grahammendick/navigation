import React from 'react';
import {Dimensions, View} from 'react-native';
import {NavigationMotion, spring} from 'navigation-react-native';

const getOverlay = ({x, y, w, h}) => {
  if (!x) return null;
  console.log(w)
  return (
    <View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        backgroundColor: 'green',
      }}>
    </View>
  );
};

export default ({stateNavigator}) => (
  <NavigationMotion
    startStateKey="grid"
    unmountedStyle={{show: spring(0)}}
    mountedStyle={(state, {color,...measurements}) => ({show: spring(1), ...measurements})}
    crumbStyle={{show: spring(1)}}
    style={{flex: 1}}
    stateNavigator={stateNavigator}>
    {({show, ...measurements}, scene) => (
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}>
        {getOverlay(measurements)}
        <View
          style={{
            flex: 1,
            opacity: Math.floor(show),
          }}>
          {scene}
        </View>
      </View>
    )}
  </NavigationMotion>
);
