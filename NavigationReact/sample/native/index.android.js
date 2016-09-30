import React from 'react';
import { AppRegistry, View } from 'react-native';
import People from './People.js';
import SceneNavigator from './SceneNavigator.js';
import { StateNavigator } from 'navigation';

const App = () => (
  <View>
    <SceneNavigator stateNavigator={stateNavigator} />
  </View>
);

const PEOPLE = [
  {name: 'Bob', dateOfBirth: '01/02/1980'},
  {name: 'Brenda', dateOfBirth: '02/03/1981'}
];

const stateNavigator = new StateNavigator([
  { key: 'people' }
]);

stateNavigator.states.people.getScene = () => <People people={PEOPLE} />;

stateNavigator.start('people');

AppRegistry.registerComponent('App', () => App);
