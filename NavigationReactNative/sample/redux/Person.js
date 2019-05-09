import React from 'react';
import {SafeAreaView, Text} from 'react-native';
import {connect} from 'react-redux';

const mapStateToProps = ({byId}, {id}) => ({person: byId[id]});

const Person = ({person: {name}}) => (
  <SafeAreaView>
    <Text>{name}</Text>
  </SafeAreaView>
);

export default connect(mapStateToProps)(Person);
