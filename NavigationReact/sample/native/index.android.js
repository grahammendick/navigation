import React from 'react';
import { AppRegistry, View } from 'react-native';
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
  { key: 'person' }
]);

stateNavigator.states.people.getScene = () => (
  <People people={PEOPLE} stateNavigator={stateNavigator} />
)

stateNavigator.states.person.getScene = (data) => {
  const person = PEOPLE.filter((person) => person.id === data.id)[0]; 
  return <Person person={person} />;
}

stateNavigator.start('people');

AppRegistry.registerComponent('App', () => App);
