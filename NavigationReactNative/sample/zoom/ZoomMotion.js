import React from 'react';
import {View} from 'react-native';
import SharedElementMotion from './SharedElementMotion';

export default ({stateNavigator}) => (
  <SharedElementMotion>
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
