import React from 'react';
import {StyleSheet, ScrollView, Text, View} from 'react-native';

export default ({color, stateNavigator}) => (
  <View style={styles.detail}>
    <ScrollView>
      <View style={[
        {backgroundColor: color},
        styles.color
      ]}>
        <Text style={styles.text}>{color}</Text>
      </View>
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  detail: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50,
  },
  color: {
    flexDirection: 'row',
    height: 500,
    padding: 10,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text:{
    fontSize: 80,
    color: '#fff',
    fontWeight: 'bold',
  },
});
