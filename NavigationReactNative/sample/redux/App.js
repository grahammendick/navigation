import React from 'react';
import {NativeEventEmitter, NativeModules} from 'react-native';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import {addNavigateHandlers, Scene} from 'navigation-react-native';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducer from './reducer';
import Blinkers from './Blinkers';
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

stateNavigator.onNavigate(() => {
  store.dispatch({
    type: "NAVIGATE",
    payload: {crumb: stateNavigator.stateContext.crumbs.length}
  });
});
var navigationEmitter = new NativeEventEmitter(NativeModules.NavigationModule);
navigationEmitter.addListener('PeekNavigate', ({crumb}) => {
  store.dispatch({
    type: "PEEK",
    payload: {crumb}
  });
});

stateNavigator.navigate('people');
addNavigateHandlers(stateNavigator);

export default ({crumb}) => (
  <Provider store={store}>
    <NavigationHandler stateNavigator={stateNavigator}>
      <Scene crumb={crumb} renderScene={(state, data) => (
        <Blinkers>{state.renderScene(data)}</Blinkers>
      )} />
    </NavigationHandler>
  </Provider>
);