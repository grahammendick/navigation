import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default ({name}) => (
  <View style={styles.scene}>
    <Text>{name}</Text>
  </View>
);

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
