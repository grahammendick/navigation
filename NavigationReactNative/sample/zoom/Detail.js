import React from 'react';
import {StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import {NavigationContext} from 'navigation-react';

export default () => (
  <NavigationContext>
    {({data: {color}, stateNavigator}) => (
      <View style={styles.detail}>
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
      </View>
    )}
  </NavigationContext>
);
  
const styles = StyleSheet.create({
  detail: {
    flex: 1,
    backgroundColor: '#fff',
  },
  back: {
    height: 50,
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    paddingTop: 20,
    paddingLeft: 20,
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