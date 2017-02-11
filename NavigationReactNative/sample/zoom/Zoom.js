import React from 'react';
import {StyleSheet, View} from 'react-native';
import {NavigationMotion, spring} from 'navigation-react-native';
import Overlay from './Overlay';

const getMeasurements = ({x,y,w,h}, show) => ({
  x: spring(x, {stiffness: 250}),
  y: spring(y, {stiffness: 250}),
  w: spring(w, {stiffness: 250}),
  h: spring(h, {stiffness: 250}),
  show: spring(show, {stiffness: 250}),
});

export default ({stateNavigator}) => (
  <NavigationMotion
    startStateKey="grid"
    unmountedStyle={(state, data) => ({...getMeasurements(data, 0)})}
    mountedStyle={(state, data) => ({...getMeasurements(data, 1)})}
    crumbStyle={{show: spring(1)}}
    style={{flex: 1}}
    stateNavigator={stateNavigator}>
    {({show,...measurements}, scene, state, data) => (
      <View style={styles.scene}>
        <Overlay {...measurements} color={data.color} />
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
