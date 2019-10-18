import React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {NavigationBar} from 'navigation-react-native';
import Tweets from './Tweets';

export default ({tweets}) => (
  <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.view}>
    <NavigationBar title="Home" />
    <Tweets tweets={tweets} />
  </ScrollView>
);

const styles = StyleSheet.create({
  toolbar: {
    height: Platform.OS === 'android' ? 50 : 0,
  },
  view: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});
