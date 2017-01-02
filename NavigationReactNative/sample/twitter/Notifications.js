import React from 'react';
import {StyleSheet, Text, ScrollView, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import Follows from './Follows';

export default ({follows, stateNavigator}) => {
  return (
    <View>
      <View style={styles.banner}>
        <Text style={styles.title}>Notifications</Text>
      </View>
      <ScrollView style={styles.view}>
        <Follows follows={follows} stateNavigator={stateNavigator} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    paddingTop: 35,
    paddingLeft: 50,
    paddingBottom: 22,
    borderBottomWidth: 2,
    borderColor: '#ccd6dd',
  },
  title: {
    fontWeight: 'bold',
  },
  view: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
  },
});
