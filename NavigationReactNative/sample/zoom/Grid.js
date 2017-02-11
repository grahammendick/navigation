import React from 'react';
import {StyleSheet, Text, View, TouchableHighlight} from 'react-native';

export default () => (
    <View style={styles.grid}>
        <Text>Hello</Text>
    </View>
);

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
