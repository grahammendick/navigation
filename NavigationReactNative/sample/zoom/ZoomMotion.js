import React from 'react';
import {Text, View} from 'react-native';
import SharedElementMotion from './SharedElementMotion';
import spring from './spring';

const getStyle = ({x, y, w, h, fontSize = 0, fontColor = 0}) => ({
  x: spring(x, {precision: 10}),
  y: spring(y, {precision: 10}),
  w: spring(w, {precision: 10}),
  h: spring(h, {precision: 10}),
  fontSize: spring(fontSize, {precision: 10}),
  fontColor: spring(fontColor, {precision: 10}),
});

export default ({stateNavigator}) => (
  <SharedElementMotion
    elementStyle={(name, data) => getStyle(data)}
    onNavigating={(name, oldRef, mountedRef) => {mountedRef.setNativeProps({style:{opacity: 0}})}}
    onNavigated={(name, oldRef, mountedRef) => {mountedRef.setNativeProps({style:{opacity: 1}})}}
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
          color: `rgb(${fontColor},${fontColor},${fontColor})`,
          zIndex: 1,
        }}>
          {color}
        </Text>
    )}
  </SharedElementMotion>
);
