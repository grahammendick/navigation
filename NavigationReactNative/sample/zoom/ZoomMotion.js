import React from 'react';
import {View} from 'react-native';
import SharedElementMotion from './SharedElementMotion';
import spring from './spring';

const getStyle = ({x, y, w, h}) => ({
  x: spring(x, {precision: 10}),
  y: spring(y, {precision: 10}),
  w: spring(w, {precision: 10}),
  h: spring(h, {precision: 10}),
});

export default ({stateNavigator}) => (
  <SharedElementMotion
    elementStyle={(name, data) => getStyle(data)}
    stateNavigator={stateNavigator}>
    {({x, y, w, h}, name, {color}) => (
      <View
        key={name}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          backgroundColor: color,
        }}>
      </View>            
    )}
  </SharedElementMotion>
);
