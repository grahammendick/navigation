import React from 'react';
import {StyleSheet, SafeAreaView, Text, TextInput, View} from 'react-native';
import {connect} from 'react-redux';

const mapStateToProps = ({people: {byId}}, {id}) => ({person: byId[id]});

const edit = (id, name) => ({
  type: "EDIT",
  payload: {id, name}
});

const Person = ({person: {id, name, dateOfBirth, email, phone}, edit}) => (
  <SafeAreaView>
    <View style={styles.field}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        onChangeText={(text) => edit(id, text)}
        style={styles.entry}>{name}
      </TextInput>
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

export default connect(mapStateToProps, {edit})(Person);

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    margin: 5,
    marginLeft: 25,
    alignItems: 'center',
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
