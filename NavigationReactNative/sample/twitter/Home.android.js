import React from 'react';
import {StyleSheet, Text, TouchableHighlight, ToolbarAndroid, View, ScrollView, ViewPagerAndroid} from 'react-native';
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
    <ViewPagerAndroid style={{flex: 1}} ref={el => this.viewPager = el}>
      <View key={1}>
        <ScrollView style={styles.view}>
          <Tweets tweets={tweets} />
        </ScrollView>
      </View>
      <View key={2}>
        <ScrollView style={styles.view}>
          <Notifications follows={follows} />
        </ScrollView>
      </View>
    </ViewPagerAndroid>
  </View>
);

const styles = StyleSheet.create({
  toolbar: {
    height: 50,
  },
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
  view: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});
