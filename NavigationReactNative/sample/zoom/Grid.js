import React from 'react';
import {StyleSheet, ScrollView, Text, View, TouchableHighlight} from 'react-native';
import {NavigationContext} from 'navigation-react';
import UIBarButtonIOS from './UIBarButtonIOS';

const colors = [
  'maroon', 'red', 'crimson', 'orange', 'brown', 'sienna', 'olive',
  'purple', 'fuchsia', 'indigo', 'green', 'navy', 'blue', 'teal', 'black'
];

export default () => (
  <NavigationContext.Consumer>
    {({data: {title}, stateNavigator}) => (
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.colors}>
          <UIBarButtonIOS title={title || "Hello"} onPress={() => {
            stateNavigator.navigate('grid', {title: title !== 'World' ? 'World' : 'Hello'})
          }} />
          <UIBarButtonIOS title="Again" />
          <UIBarButtonIOS title="And" />
          {colors.map(color => (
            <TouchableHighlight
              style={[
                {backgroundColor: color},
                styles.color
              ]}
              underlayColor={color}
              key={color}
              onPress={() => {
                stateNavigator.navigate('detail', {color});
              }}>
              <Text style={styles.text}>{color}</Text>
            </TouchableHighlight>
          ))}
        </View>
      </ScrollView>
    )}
  </NavigationContext.Consumer>
);

const styles = StyleSheet.create({
  colors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  color: {
    width: 100,
    height: 150,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  }
});