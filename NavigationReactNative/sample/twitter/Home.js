import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

export default ({ stateNavigator }) => (
  <View style={styles.view}>
    <Text style={styles.home}>Home</Text>
    <TouchableHighlight underlayColor="white" onPress={() => {
      stateNavigator.navigate('tweet');
    } }>
      <Text>Tweet</Text>
    </TouchableHighlight>
  </View>
);

const styles = StyleSheet.create({
  view: {
    margin: 25,
  },
  home: {
    paddingTop: 10,
    fontSize: 50,
    marginTop: 50,
  },
});
