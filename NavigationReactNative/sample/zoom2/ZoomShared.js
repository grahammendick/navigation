import React from 'react';
import {Text, Image} from 'react-native';
import {SharedElementMotion} from 'navigation-react-native';

export default ({stateNavigator}) => (
  <SharedElementMotion
    elementStyle={(name, data) => data}
    onAnimating={(name, oldRef, mountedRef, oldData, mountedData) => {}}
    onAnimated={(name, oldRef, mountedRef) => {}}
    stateNavigator={stateNavigator}>
    {({x, y, w, h}, name) => (
      !name === 'image' ? <Image
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          backgroundColor: color,
        }}>
      </Image> : <Text          
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          fontSize,
          textAlign: 'center',
          fontWeight: 'bold',
          color: fontColor,
          zIndex: 1,
        }}>
        </Text>
    )}
  </SharedElementMotion>
);
