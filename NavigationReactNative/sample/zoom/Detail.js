import React from 'react';
import {StyleSheet, ScrollView, Text, View, TouchableHighlight} from 'react-native';
import {NavigationContext} from 'navigation-react';

export default ({color}) => (
  <NavigationContext.Consumer>
    {({stateNavigator}) => (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{flex:1}}>
          <TouchableHighlight
            underlayColor="#fff"
            onPress={() => {
              stateNavigator.navigateBack(1);
            }}>
            <Text style={styles.back}>X</Text>
          </TouchableHighlight>
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
  back: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  color: {
    flex: .6,
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