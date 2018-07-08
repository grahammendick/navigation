import React from 'react';
import {StyleSheet, View, ViewPagerAndroid} from 'react-native';
import Tweets from './Tweets';
import Notifications from './Notifications';

export default ({tweets, follows}) => (
  <ViewPagerAndroid style={{flex: 1}} initialPage={0}>
    <View style={styles.view} key={1}>
      <Tweets tweets={tweets} />
    </View>
    <View style={styles.view} key={1}>
      <Notifications follows={follows} />
    </View>
  </ViewPagerAndroid>
);

const styles = StyleSheet.create({
  view: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});
