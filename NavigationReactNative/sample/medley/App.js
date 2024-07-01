import React from 'react';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import {NavigationStack} from 'navigation-react-native';
import {Stack} from './Direction';

const stateNavigator = new StateNavigator([
  {key: 'north', trackCrumbTrail: true},
  {key: 'east', trackCrumbTrail: true},
  {key: 'south', trackCrumbTrail: true},
  {key: 'west', trackCrumbTrail: true},
]);

const App = () => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <Stack />
  </NavigationHandler>
);

export default App;
