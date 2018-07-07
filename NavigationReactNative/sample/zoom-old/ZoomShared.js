import React from 'react';
import {StyleSheet, Text, View, Platform} from 'react-native';
import {SharedElementMotion} from 'navigation-react-native';

export default ({sharedElements}) => (
  <SharedElementMotion
    sharedElements={sharedElements}
    style={styles.motion}
    onAnimating={(name, ref) => {ref.setNativeProps({style:{opacity: 0}})}}
    onAnimated={(name, ref) => {ref.setNativeProps({style:{opacity: 1}})}}>
    {({x, y, w, h, fontSize, fontColor}, name, {color}) => (
      !name.startsWith('text') ? <View key={name}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          backgroundColor: color,
        }}>
      </View> : <Text key={name}
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
          ...Platform.select({
            ios: {zIndex: 1},
            android: {elevation: 1},
          }),
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

