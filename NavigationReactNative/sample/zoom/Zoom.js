import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {NavigationMotion, spring} from 'navigation-react-native';

const getStyle = ({x, y, w, h, width}, show, translate = false) => ({
  x: spring(x || 0, {stiffness: 250}),
  y: spring(y || 0, {stiffness: 250}),
  w: spring(w || 0, {stiffness: 250}),
  h: spring(h || 0, {stiffness: 250}),
  show: spring(show, {stiffness: 250}),
  translate: spring(translate && Dimensions.get('window').width !== width ? 1 : 0, {stiffness: 250}),
});

export default ({stateNavigator}) => (
  <NavigationMotion
    startStateKey="grid"
    unmountedStyle={(state, data) => ({...getStyle(data, 0, true)})}
    mountedStyle={(state, data) => ({...getStyle(data, 1)})}
    crumbStyle={{...getStyle({}, 1)}}
    style={{flex: 1}}
    stateNavigator={stateNavigator}>
    {({show, x, y, w, h, translate}, scene, url, state, {color}) => (
      <View
        key={url}
        style={[
          styles.scene,
          {transform: [
            {translateX: Dimensions.get('window').width * translate},
          ]},
        ]}>
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
        <View
          style={{
            flex: 1,
            opacity: Math.ceil(translate) || Math.floor(show),
          }}>
          {scene}
        </View>
      </View>
    )}
  </NavigationMotion>
);

const styles = StyleSheet.create({
  scene: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
