import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default ({ person }) => (
  <View style={styles.container}>
    <Text style={styles.text}>Name: {person.name}</Text>
    <Text style={styles.text}>Date of Birth: {person.dateOfBirth}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  text: {
    fontSize: 16,
  },
});

