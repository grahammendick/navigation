import React from 'react';
import {StyleSheet, SafeAreaView, Text, TextInput, View} from 'react-native';
import {connect} from 'react-redux';

const mapStateToProps = ({byId}, {id}) => ({person: byId[id]});

const Person = ({person: {name}}) => (
  <SafeAreaView>
    <View style={styles.field}>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.entry}>{name}</TextInput>
    </View>
  </SafeAreaView>
);

export default connect(mapStateToProps)(Person);

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    padding: 20,
  },
  label: {
    width: 100,
    fontWeight: 'bold',
    fontSize: 20,
  },
  entry: {
    fontSize: 20,
  },
});
