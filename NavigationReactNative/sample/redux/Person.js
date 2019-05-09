import React from 'react';
import {StyleSheet, SafeAreaView, Text, TextInput, View} from 'react-native';
import {connect} from 'react-redux';

const mapStateToProps = ({byId}, {id}) => ({person: byId[id]});

const Person = ({person: {name, dateOfBirth, email, phone}}) => (
  <SafeAreaView>
    <View style={styles.field}>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.entry}>{name}</TextInput>
    </View>
    <View style={styles.field}>
      <Text style={styles.label}>DOB</Text>
      <Text style={styles.entry}>{dateOfBirth}</Text>
    </View>
    <View style={styles.field}>
      <Text style={styles.label}>Email</Text>
      <Text style={styles.entry}>{email}</Text>
    </View>
    <View style={styles.field}>
      <Text style={styles.label}>Phone</Text>
      <Text style={styles.entry}>{phone}</Text>
    </View>
  </SafeAreaView>
);

export default connect(mapStateToProps)(Person);

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    margin: 5,
    marginLeft: 25,
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
