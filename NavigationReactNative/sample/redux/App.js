import React from 'react';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import {NavigationStack} from 'navigation-react-native';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducer from './reducer';
import People from './People';
import Person from './Person';

const stateNavigator = new StateNavigator([
  {key: 'people', title: 'People'},
  {key: 'person', title: 'Person', trackCrumbTrail: true},
]);

const {people, person} = stateNavigator.states;
people.renderScene = () => <People />;
person.renderScene = ({id}) => <Person id={id} />;

const store = createStore(reducer);

stateNavigator.navigate('people');

export default () => (
  <Provider store={store}>
    <NavigationHandler stateNavigator={stateNavigator}>
      <NavigationStack />
    </NavigationHandler>
  </Provider>
);