import React from 'react';
import {Text, View} from 'react-native';
import SharedElementMotion from './SharedElementMotion';
import spring from './spring';

const getStyle = ({x, y, w, h, fontSize = 0, fontColor = 0}) => ({
  x: spring(x, {precision: 1}),
  y: spring(y, {precision: 1}),
  w: spring(w, {precision: 1}),
  h: spring(h, {precision: 1}),
  fontSize: spring(fontSize, {precision: 1}),
  fontColor: spring(fontColor, {precision: 1}),
});

export default ({stateNavigator}) => (
  <SharedElementMotion
    elementStyle={(name, data) => getStyle(data)}
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
