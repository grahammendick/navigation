import React from 'react';
import {StyleSheet, ScrollView, processColor} from 'react-native';
import {NavigationBarIOS} from 'navigation-react-native';
import Tweets from './Tweets';

export default ({tweets}) => (
  <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.view}>
    <NavigationBarIOS title="Home" barTintColor="red" />
    <Tweets tweets={tweets} />
  </ScrollView>
);

const styles = StyleSheet.create({
  view: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});
