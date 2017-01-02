import React from 'react';
import {StyleSheet, Text, ScrollView, View} from 'react-native';
import Footer from './Footer';
import Tweets from './Tweets';

export default ({tweets, stateNavigator}) => (
  <View>
    <View style={styles.banner}>
      <Text style={styles.title}>Home</Text>
      <View style={styles.tabs}>
        <Footer
          activeTab="timeline" />
      </View>
    </View>
    <ScrollView style={styles.view}>
      <Tweets tweets={tweets} stateNavigator={stateNavigator} />
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  banner: {
    paddingTop: 30,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderColor: '#ccd6dd',
  },
  title: {
    paddingLeft: 50,
    fontWeight: 'bold',
  },
  view: {
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
  },
  tabs: {
    height: 40,
  },
});
