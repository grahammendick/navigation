import React from 'react';
import {StyleSheet, View} from 'react-native';
import {NavigationMotion} from 'navigation-react-mobile';
import ZoomShared from './ZoomShared';

export default () => (
  <NavigationMotion
    unmountedStyle={{opacity: 0}}
    mountedStyle={{opacity: 1}}
    crumbStyle={{opacity: 0}}
    sharedElementMotion={props => <ZoomShared {...props} />}>
    {({opacity}, scene, key) => (
      <View key={key}
        style={[styles.scene, {opacity}]}>
        {scene}
      </View>
    )}
  </NavigationMotion>
);

const styles = StyleSheet.create({
  scene: {
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    overflow: 'auto',
    padding: 5,
    display: 'flex',
    justifyContent: 'center',
  },
});