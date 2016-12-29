import React from 'react';
import { StyleSheet, Text, Image, View, TouchableHighlight } from 'react-native';
import Tweets from './Tweets';

export default ({tweets, stateNavigator}) => (
  <View style={styles.view}>
    <Text style={styles.title}>Home</Text>
    <Tweets tweets={tweets} stateNavigator={stateNavigator} />
  </View>
);

const styles = StyleSheet.create({
  title: {
    paddingTop: 40,
    paddingLeft: 60,
    paddingBottom: 40,
    fontWeight: 'bold',
  },
});
