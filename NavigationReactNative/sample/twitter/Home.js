import React from 'react';
import {Platform, StyleSheet, ScrollView} from 'react-native';
import {NavigationBar} from 'navigation-react-native';
import Tweets from './Tweets';

export default ({tweets}) => (
  <>
    <NavigationBar title="Home" barTintColor={Platform.OS === 'android' ? '#fff' : null} />
    <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.view}>
      <Tweets tweets={tweets} />
    </ScrollView>
  </>
);

const styles = StyleSheet.create({
  view: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});
