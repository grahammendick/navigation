import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {NavigationContext} from 'navigation-react';

export default ({person: {id, name}}) => (
  <NavigationContext.Consumer>
    {({stateNavigator}) => (
      <TouchableOpacity
        onPress={() => {
          stateNavigator.navigate('person', {id});
        }}>
        <View>
          <Text>{name}</Text>
        </View>
      </TouchableOpacity>
    )}
  </NavigationContext.Consumer>
);
