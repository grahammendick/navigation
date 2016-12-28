import React from 'react';
import {StyleSheet, Text, Image, View, TouchableHighlight} from 'react-native';
import Tweets from './Tweets';

export default ({tweet: {name, replies}, stateNavigator}) => (
  <View style={styles.view}>
    <TouchableHighlight underlayColor="white" onPress={() => {
      stateNavigator.navigateBack(1);
    }}>
      <Text>Back</Text>
    </TouchableHighlight>
    <Text style={styles.tweet}>Tweet</Text>
    <Tweets tweets={replies} stateNavigator={stateNavigator} />
  </View>
);

const styles = StyleSheet.create({
  view: {
    margin: 20,
  },
  tweet: {
    fontSize: 50,
    marginTop: 50,
  },
});
