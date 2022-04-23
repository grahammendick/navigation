import React from 'react';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import Home from './Home';
import Notifications from './Notifications';
import Tabs from './Tabs';
import Tweet from './Tweet';
import Timeline from './Timeline';
import Stack from './Stack';

const stateNavigator = new StateNavigator([
  {key: 'tabs'},
  {key: 'home'},
  {key: 'notifications'},
  {key: 'tweet', trackCrumbTrail: true},
  {key: 'timeline', trackCrumbTrail: true}
]);
stateNavigator.navigate('tabs');

const App = () => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <Stack
      crumbStyle={from => from ? 'scale_in' : 'scale_out'}
      unmountStyle={from => from ? 'slide_in' : 'slide_out'}
    >
      <Stack.Scene stateKey="tabs"><Tabs /></Stack.Scene>
      <Stack.Scene stateKey="home"><Home /></Stack.Scene>
      <Stack.Scene stateKey="notifications"><Notifications /></Stack.Scene>
      <Stack.Scene stateKey="tweet"><Tweet /></Stack.Scene>
      <Stack.Scene stateKey="timeline"><Timeline /></Stack.Scene>
    </Stack>
  </NavigationHandler>
);

export default App;
