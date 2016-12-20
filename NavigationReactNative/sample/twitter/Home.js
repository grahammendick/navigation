import React from 'react';
import { StyleSheet, Text } from 'react-native';

export default () => <Text style={styles.home}>Home</Text>;

const styles = StyleSheet.create({
  home: {
    fontSize: 50,
    marginTop: 50,
  },
});
