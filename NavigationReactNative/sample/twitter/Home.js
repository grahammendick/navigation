import React from 'react';
import { StyleSheet, Text, Image, ScrollView, View, TouchableHighlight } from 'react-native';
import Tweets from './Tweets';

export default ({tweets, stateNavigator}) => (
  <View>
    <View style={styles.banner}>
      <Text style={styles.title}>Home</Text>
    </View>
    <ScrollView style={styles.view}>
      <Tweets tweets={tweets} stateNavigator={stateNavigator} />
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  banner: {
    paddingTop: 40,
    paddingLeft: 50,
    paddingBottom: 27,
    borderBottomWidth: 2,
    borderColor: '#ccd6dd',
  },
  title: {
    fontWeight: 'bold',
  },
  view: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
  },
});
