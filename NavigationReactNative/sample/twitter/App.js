import React from 'react';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import Home from './Home';
import Notifications from './Notifications';
import Tabs from './Tabs';
import Tweet from './Tweet';
import Timeline from './Timeline';
import { NavigationStack, Scene } from 'navigation-react-native';

const stateNavigator = new StateNavigator([
  {key: 'tabs'},
  {key: 'home'},
  {key: 'notifications'},
  {key: 'tweet', trackCrumbTrail: true},
  {key: 'timeline', trackCrumbTrail: true}
]);

const App = () => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <NavigationStack
      crumbStyle={from => from ? 'scale_in' : 'scale_out'}
      unmountStyle={from => from ? 'slide_in' : 'slide_out'}
    >
      <Scene stateKey="tabs"><Tabs /></Scene>
      <Scene stateKey="home"><Home /></Scene>
      <Scene stateKey="notifications"><Notifications /></Scene>
      <Scene stateKey="tweet"><Tweet /></Scene>
      <Scene stateKey="timeline"><Timeline /></Scene>
    </NavigationStack>
  </NavigationHandler>
);

export default App;
