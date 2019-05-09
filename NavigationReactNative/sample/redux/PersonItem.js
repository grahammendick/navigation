import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {NavigationContext} from 'navigation-react';
import {connect} from 'react-redux';

const mapStateToProps = ({byId}, {id}) => ({person: byId[id]});

const PersonItem = ({person: {id, name}}) => (
  <NavigationContext.Consumer>
    {({stateNavigator}) => (
      <TouchableOpacity
        onPress={() => {
          stateNavigator.navigate('person', {id});
        }}>
        <View>
          <Text style={styles.name}>{name}</Text>
        </View>
      </TouchableOpacity>
    )}
  </NavigationContext.Consumer>
);

export default connect(mapStateToProps)(PersonItem);

const styles = StyleSheet.create({
  name: {
    fontSize: 20,
    margin: 5,
    marginLeft: 25,
  },
});
