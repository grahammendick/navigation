import React from 'react';
import {StyleSheet, ScrollView, Text, View} from 'react-native';

export default ({color, stateNavigator}) => (
  <View style={styles.detail}>
    <View style={[
      {backgroundColor: color},
      styles.color
    ]} />
    <Text style={styles.text}>{color}</Text>
  </View>
);

const styles = StyleSheet.create({
  detail: {
    flex: 1,
    backgroundColor: '#fff',
  },
  color: {
    flex: .6,
    margin: 20,
    marginTop: 50,
  },
  text:{
    flex: .4,
    fontSize: 80,
    color: '#000',
    textAlign:'center',
    fontWeight: 'bold',
  },
});
