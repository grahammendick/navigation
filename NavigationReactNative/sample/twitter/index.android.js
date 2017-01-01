import React from 'react';
import {AppRegistry, View} from 'react-native';
import createStateNavigator from './createStateNavigator';
import Twitter from './Twitter';

const stateNavigator = createStateNavigator();

export default TwitterAndroid = () => (
  <Twitter
    stateNavigator={stateNavigator}
    startStateKey="home"
    visible={true}
    offset={20} />
);

AppRegistry.registerComponent('twitter', () => TwitterAndroid);
