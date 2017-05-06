import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SharedElementMotion} from 'navigation-react-native';

export default ({stateNavigator}) => (
  <SharedElementMotion
    elementStyle={(name, data) => data}
    style={styles.motion}
    onAnimating={(name, oldRef, mountedRef, oldData, mountedData) => {
      mountedData.hide && mountedRef.setNativeProps({style:{opacity: 0}})
    }}
    onAnimated={(name, oldRef, mountedRef) => {mountedRef.setNativeProps({style:{opacity: 1}})}}
    stateNavigator={stateNavigator}>
    {({x, y, w, h, fontSize, fontColor}, name, {color}) => (
      !name.startsWith('text') ? <View
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          backgroundColor: color,
        }}>
      </View> : <Text          
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
          {color}
        </Text>
    )}
  </SharedElementMotion>
);

const styles = StyleSheet.create({
  motion: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
});

