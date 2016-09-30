import React from 'react';
import { AppRegistry, BackAndroid, View } from 'react-native';
import People from './People.js';
import Person from './Person.js';
import SceneNavigator from './SceneNavigator.js';
import { StateNavigator } from 'navigation';

const App = () => (
  <View>
    <SceneNavigator stateNavigator={stateNavigator} />
  </View>
);

const PEOPLE = [
  {id: 1, name: 'Bob', dateOfBirth: '01/02/1980'},
  {id: 2, name: 'Brenda', dateOfBirth: '02/03/1981'}
];

const stateNavigator = new StateNavigator([
  { key: 'people' },
  { key: 'person', trackCrumbTrail: true }
]);

stateNavigator.states.people.renderScene = () => (
  <People people={PEOPLE} stateNavigator={stateNavigator} />
)

stateNavigator.states.person.renderScene = (data) => {
  const person = PEOPLE.filter((person) => person.id === data.id)[0]; 
  return <Person person={person} />;
}

stateNavigator.start('people');

AppRegistry.registerComponent('App', () => App);

BackAndroid.addEventListener('hardwareBackPress', () => {
  var canNavigateBack = stateNavigator.canNavigateBack(1);
  if (canNavigateBack)
    stateNavigator.navigateBack(1);
  return canNavigateBack;
});
