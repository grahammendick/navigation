import React from 'react';
import {StyleSheet, Text, TouchableHighlight, ToolbarAndroid, View, ViewPagerAndroid} from 'react-native';
import Tweets from './Tweets';
import Notifications from './Notifications';

export default ({tweets, follows}) => (
  <View style={{flex: 1}}>
    <ToolbarAndroid title="Home" style={styles.toolbar} />
    <View style={styles.tabs}>
      <TouchableHighlight
        underlayColor="white"
        style={styles.tab}
        onPress={() => this.viewPager.setPage(0)}>
        <Text style={styles.text}>Home</Text>
      </TouchableHighlight>
      <TouchableHighlight
        underlayColor="white"
        style={styles.tab}
        onPress={() => this.viewPager.setPage(1)}>
        <Text style={styles.text}>Notifications</Text>
      </TouchableHighlight>
    </View>
    <ViewPagerAndroid style={{flex: 1}} initialPage={0} ref={el => this.viewPager = el}>
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
  tabs: {
    height: 60,
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    alignItems: 'center'
  },
  text: {
    fontSize: 18,
  },
  toolbar: {
    height: 50,
  },
});
