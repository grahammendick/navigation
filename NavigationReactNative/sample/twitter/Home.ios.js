import React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import Tweets from './Tweets';

export default ({tweets}) => (
  <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.view}>
    <Tweets tweets={tweets} />
  </ScrollView>
);

const styles = StyleSheet.create({
  view: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});
