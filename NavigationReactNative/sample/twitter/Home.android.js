import React from 'react';
import {StyleSheet, ToolbarAndroid, View, ViewPagerAndroid} from 'react-native';
import Tweets from './Tweets';
import Notifications from './Notifications';

export default ({tweets, follows}) => (
  <View style={{flex: 1}}>
    <ToolbarAndroid title="Home" style={styles.toolbar} />
    <ViewPagerAndroid style={{flex: 1}} initialPage={0}>
      <View style={styles.view} key={1}>
        <Tweets tweets={tweets} />
      </View>
      <View style={styles.view} key={1}>
        <Notifications follows={follows} />
      </View>
    </ViewPagerAndroid>
  </View>
);

const styles = StyleSheet.create({
  toolbar: {
    height: 50,
  },
});
