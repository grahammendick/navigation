import React from 'react';
import {View} from 'react-native';
import SharedElementMotion from './SharedElementMotion';
import spring from './spring';

export default ({stateNavigator}) => (
  <SharedElementMotion
    style={{flex: 1}}
    toStyle={({x, y, w, h}) => ({x: spring(x), y: spring(y), w: spring(w), h: spring(h)})}
    stateNavigator={stateNavigator}>
    {({x, y, w, h}, sharedElement, name) => (
      <View
        key={name}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
        }}>
        {sharedElement}
      </View>            
    )}
  </SharedElementMotion>
);
