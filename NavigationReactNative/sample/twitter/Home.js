import React from 'react';
import {Platform, StyleSheet, ScrollView} from 'react-native';
import {NavigationBar, CoordinatorLayout} from 'navigation-react-native';
import Tweets from './Tweets';

export default ({tweets}) => (
  <CoordinatorLayout>
    <NavigationBar title="Home" barTintColor={Platform.OS === 'android' ? '#fff' : null} />
    <ScrollView
      nestedScrollEnabled={true}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.view}>
      <Tweets tweets={tweets} />
    </ScrollView>
  </CoordinatorLayout>
);

const styles = StyleSheet.create({
  view: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});
