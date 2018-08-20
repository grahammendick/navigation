import React from 'react';
import {StyleSheet, ScrollView, Text, View, TouchableHighlight} from 'react-native';
import {NavigationContext} from 'navigation-react';
import {RightBarIOS, BarButtonIOS} from 'navigation-react-native';

export default ({color}) => (
  <NavigationContext.Consumer>
    {({stateNavigator}) => (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{flex:1}}>
          <RightBarIOS>
            <BarButtonIOS title="Cancel" onPress={() => {
              stateNavigator.navigateBack(1);
            }} />
          </RightBarIOS>
          <View
            style={[
              {backgroundColor: color},
              styles.color
            ]} />
          <Text style={styles.text}>{color}</Text>
      </ScrollView>
    )}
  </NavigationContext.Consumer>
);
  
const styles = StyleSheet.create({
  color: {
    flex: .6,
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
  },
  text:{
    flex: .4,
    fontSize: 80,
    color: '#000',
    textAlign:'center',
    fontWeight: 'bold',
  },
});