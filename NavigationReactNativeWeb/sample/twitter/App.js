import React, {useState} from 'react';
import {Platform, View} from 'react-native';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import {NavigationStack, Scene, TabBar, TabBarItem} from 'navigation-react-native';
import createStateNavigator from './createStateNavigator';
import Home from './Home';
import Notifications from './Notifications';
import Tabs from './Tabs';
import Tweet from './Tweet';
import Timeline from './Timeline';

var stateNavigator = createStateNavigator();

const App = () => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <NavigationStack
      customAnimation
      crumbStyle={[
        {type: 'alpha', start: 0},
        {type: 'scale', startX: 0.8, startY: '0.8'},
        {type: 'translate', startX: '5%'},
      ]}
      unmountStyle={{type: 'translate', startX: '100%'}}
    >
      <Scene stateKey="tabs"><Tabs /></Scene>
      <Scene stateKey="notifications"><Notifications /></Scene>
      <Scene stateKey="tweet"><Tweet /></Scene>
      <Scene stateKey="timeline"><Timeline /></Scene>
    </NavigationStack>
  </NavigationHandler>
);

export default App;
