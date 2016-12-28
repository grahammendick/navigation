import React from 'react';
import { StyleSheet, Text, Image, View, TouchableHighlight } from 'react-native';
import Tweets from './Tweets';

export default ({tweets, stateNavigator}) => (
  <View style={styles.view}>
    <Text style={styles.home}>Home</Text>
    <Tweets tweets={tweets} stateNavigator={stateNavigator} />
  </View>
);

const styles = StyleSheet.create({
  home: {
    paddingTop: 10,
    fontSize: 50,
    marginTop: 50,
  },
});
