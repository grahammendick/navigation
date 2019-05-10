import React, {useContext} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {NavigationContext} from 'navigation-react';
import {connect} from 'react-redux';

const mapStateToProps = ({people: {byId}}, {id}) => ({person: byId[id]});

const PersonItem = ({person: {id, name}}) => {
  const {stateNavigator} = useContext(NavigationContext);
  return (
    <TouchableOpacity
      onPress={() => {
        stateNavigator.navigate('person', {id});
      }}>
      <View>
        <Text style={styles.name}>{name}</Text>
      </View>
    </TouchableOpacity>
  )
};

export default connect(mapStateToProps)(PersonItem);

const styles = StyleSheet.create({
  name: {
    fontSize: 20,
    margin: 5,
    marginLeft: 25,
  },
});
