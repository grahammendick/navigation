import React from 'react';
import {SafeAreaView, Text, TouchableOpacity} from 'react-native';
import {StateNavigator} from 'navigation';
import {NavigationHandler, NavigationContext} from 'navigation-react';
import {NavigationStack} from 'navigation-react-native';

var stateNavigator = new StateNavigator([
  {key: 'hello'},
  {key: 'world', trackCrumbTrail: true}
]);

var {hello, world} = stateNavigator.states;

hello.renderScene = () => (
  <NavigationContext.Consumer>
    {({stateNavigator}) => (
      <SafeAreaView>
        <TouchableOpacity
          onPress={() => {
            stateNavigator.navigate('world');
          }}>
          <Text>Hello</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )}
  </NavigationContext.Consumer>
);

world.renderScene = () => (
  <SafeAreaView>
    <Text>World</Text>
  </SafeAreaView>
);

stateNavigator.navigate('hello');

export default () => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <NavigationStack />
  </NavigationHandler>
);