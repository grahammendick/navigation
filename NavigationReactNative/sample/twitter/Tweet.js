import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

export default ({ stateNavigator }) => (
  <View style={styles.view}>
    <TouchableHighlight underlayColor="white" onPress={() => {
      stateNavigator.navigateBack(1);
    }}>
      <Text>Back</Text>
    </TouchableHighlight>
    <Text style={styles.tweet}>Tweet</Text>
    <TouchableHighlight underlayColor="white" onPress={() => {
      stateNavigator.navigate('tweet');
    }}>
      <Text>Tweet {stateNavigator.stateContext.crumbs.length}</Text>
    </TouchableHighlight>
  </View>
);

const styles = StyleSheet.create({
  view: {
    margin: 25,
  },
  tweet: {
    fontSize: 50,
    marginTop: 50,
  },
});
