import React from 'react';
import {Dimensions, View} from 'react-native';
import {NavigationMotion, spring} from 'navigation-react-native';

const getOverlay = ({x, y, w, h}, color) => {
  console.log(x)
  if (!x) return null;
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

const measurements = ({x,y,w,h}, show) => ({
  x: spring(x, {stiffness: 250}),
  y: spring(y, {stiffness: 250}),
  w: spring(w, {stiffness: 250}),
  h: spring(h, {stiffness: 250}),
  show: spring(show, {stiffness: 250}),
});

export default ({stateNavigator}) => (
  <NavigationMotion
    startStateKey="grid"
    unmountedStyle={(state, data) => ({...measurements(data, 0)})}
    mountedStyle={(state, data) => ({...measurements(data, 1)})}
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
        {getOverlay(measurements, stateNavigator.stateContext.data.color)}
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
