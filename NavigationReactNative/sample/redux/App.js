import React from 'react';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import {addNavigateHandlers, Scene} from 'navigation-react-native';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducer from './reducer';
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

var store = createStore(reducer);

stateNavigator.navigate('people');
addNavigateHandlers(stateNavigator);

export default ({crumb}) => (
  <Provider store={store}>
    <NavigationHandler stateNavigator={stateNavigator}>
      <Scene crumb={crumb} />
    </NavigationHandler>
  </Provider>
);