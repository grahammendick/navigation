import React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import Follows from './Follows';

export default ({follows}) => (
  <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.view}>
    <Follows follows={follows} />
  </ScrollView>
);

const styles = StyleSheet.create({
  view: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});
