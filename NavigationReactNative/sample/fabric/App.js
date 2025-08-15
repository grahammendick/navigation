import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import Home from './Home';
import Notifications from './Notifications';
import Tabs from './Tabs';
import Tweet from './Tweet';
import Timeline from './Timeline';
import {NavigationStack, Scene} from 'navigation-react-native';

const stateNavigator = new StateNavigator([
  {key: 'tabs'},
  {key: 'home'},
  {key: 'notifications'},
  {key: 'tweet', trackCrumbTrail: true},
  {key: 'timeline', trackCrumbTrail: true}
]);

const App = () => (
  <SafeAreaProvider>
    <NavigationHandler stateNavigator={stateNavigator}>
      <NavigationStack
        crumbStyle={[
          {type: 'alpha', start: 0},
          {type: 'scale', startX: 0.8, startY: 0.8},
          {type: 'translate', startX: '5%'},
        ]}
        unmountStyle={{type: 'translate', startX: '100%'}}
      >
        <Scene stateKey="tabs"><Tabs /></Scene>
        <Scene stateKey="home"><Home /></Scene>
        <Scene stateKey="notifications"><Notifications /></Scene>
        <Scene stateKey="tweet"><Tweet /></Scene>
        <Scene stateKey="timeline"><Timeline /></Scene>
      </NavigationStack>
    </NavigationHandler>
  </SafeAreaProvider>
);

export default App;
