import React from 'react';
import People from './People.js';
import Person from './Person.js';
import { StateNavigator } from 'navigation';

export default () => {
  const stateNavigator = new StateNavigator([
    { key: 'people' },
    { key: 'person', trackCrumbTrail: true }
  ]);

  const PEOPLE = [
    {id: 1, name: 'Bob', dateOfBirth: '01/02/1980'},
    {id: 2, name: 'Brenda', dateOfBirth: '02/03/1981'}
  ];

  stateNavigator.states.people.renderScene = () => (
    <People people={PEOPLE} stateNavigator={stateNavigator} />
  )

  stateNavigator.states.person.renderScene = (data) => {
    const person = PEOPLE.filter((person) => person.id === data.id)[0]; 
    return <Person person={person} />;
  }

  return stateNavigator;
}
