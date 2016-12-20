import React from 'react';
import { StyleSheet, Text } from 'react-native';

export default () => <Text style={styles.tweet}>Tweet</Text>;

const styles = StyleSheet.create({
  tweet: {
    fontSize: 50,
    marginTop: 50,
  },
});
