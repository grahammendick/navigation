import React from 'react';
import {View} from 'react-native';

export default ({x, y, w, h, color}) => (
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
