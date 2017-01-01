import React from 'react';
import {AppRegistry, StyleSheet, View} from 'react-native';
import createStateNavigator from './createStateNavigator';
import Twitter from './Twitter';

const stateNavigator = createStateNavigator();

export default TwitterAndroid = () => (
  <Twitter
    stateNavigator={stateNavigator}
    startStateKey="home"
    visible={true}
    offset={20}
    style={styles.app} />
);

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: 'black'
  },
});

AppRegistry.registerComponent('twitter', () => TwitterAndroid);
