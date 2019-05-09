import React from 'react';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import {addNavigateHandlers, Scene} from 'navigation-react-native';
import People from './People';
import Person from './Person';

const colors = [
  'maroon', 'red', 'crimson', 'orange', 'brown', 'sienna', 'olive',
  'purple', 'fuchsia', 'indigo', 'green', 'navy', 'blue', 'teal', 'black'
];

var stateNavigator = new StateNavigator([
  {key: 'people', title: 'People'},
  {key: 'person', title: 'Person', trackCrumbTrail: true},
]);

const { people, person } = stateNavigator.states;
people.renderScene = () => <People />;
person.renderScene = ({ id }) => <Person id={id} />;

stateNavigator.navigate('people');
addNavigateHandlers(stateNavigator);

export default ({crumb}) => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <Scene crumb={crumb} />
  </NavigationHandler>
);