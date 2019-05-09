import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
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
          <Text>{name}</Text>
        </View>
      </TouchableOpacity>
    )}
  </NavigationContext.Consumer>
);

export default connect(mapStateToProps)(PersonItem);
