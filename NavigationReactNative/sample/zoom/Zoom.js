import React from 'react';
import {Dimensions, View} from 'react-native';
import {NavigationMotion, spring} from 'navigation-react-native';

const getOverlay = ({x, y, w, h}, color) => {
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
        backgroundColor: color,
      }}>
    </View>
  );
};

export default ({stateNavigator}) => (
  <NavigationMotion
    startStateKey="grid"
    unmountedStyle={(state, {color,...measurements}) => ({show: spring(0), ...measurements})}
    mountedStyle={{show: spring(1), x: spring(10), y: spring(50), w: spring(350), h: spring(400)}}
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
        {getOverlay(measurements, 'green')}
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
