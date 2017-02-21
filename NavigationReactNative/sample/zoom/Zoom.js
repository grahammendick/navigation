import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {NavigationMotion, spring} from 'navigation-react-native';

const getStyle = ({x, y, w, h, width}, show) => ({
  x: spring(x || 0, {stiffness: 250}),
  y: spring(y || 0, {stiffness: 250}),
  w: spring(w || 0, {stiffness: 250}),
  h: spring(h || 0, {stiffness: 250}),
  show: spring(show, {stiffness: 250}),
});

export default ({stateNavigator}) => (
  <NavigationMotion
    startStateKey="grid"
    unmountedStyle={(state, data, sceneData) => {
      if (sceneData && sceneData.fromX)
        data = {...data, x: sceneData.fromX, y: sceneData.fromY, w: sceneData.fromW, h: sceneData.fromH};
      return getStyle(data, 0);
    }}
    mountedStyle={(state, data, sceneData) => getStyle({...data, ...sceneData}, 1)}
    crumbStyle={getStyle({}, 1)}
    style={{flex: 1}}
    stateNavigator={stateNavigator}>
    {({show, x, y, w, h}, scene, url, state, {color}) => (
      <View key={url} style={styles.scene}>
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
            opacity: Math.floor(show),
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
