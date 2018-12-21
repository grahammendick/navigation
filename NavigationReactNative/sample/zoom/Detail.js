import React from 'react';
import {StyleSheet, ScrollView, Text, View, Platform, TouchableHighlight} from 'react-native';
import {NavigationContext} from 'navigation-react';
import {RightBarIOS, BarButtonIOS, SharedElementAndroid} from 'navigation-react-native';

export default ({color}) => (
  <NavigationContext.Consumer>
    {({stateNavigator}) => (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{flex:1}}>
          <RightBarIOS>
            <BarButtonIOS systemItem="cancel" onPress={() => {
              stateNavigator.navigateBack(1);
            }} />
          </RightBarIOS>
          {Platform.OS === 'android' && <TouchableHighlight
            underlayColor="#fff"
            onPress={() => {
              stateNavigator.navigateBack(1);
            }}>
            <Text style={styles.back}>X</Text>
          </TouchableHighlight>}
          <SharedElementAndroid name={color} style={styles.color}>
            <View style={{backgroundColor: color}} />
          </SharedElementAndroid>
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
  },
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