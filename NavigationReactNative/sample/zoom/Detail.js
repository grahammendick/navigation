import React from 'react';
import {StyleSheet, ScrollView, Text, View, TouchableHighlight} from 'react-native';
import {NavigationBackAndroid, spring} from 'navigation-react-native';

export default ({color, moveScene, stateNavigator}) => {
  const {url} = stateNavigator.stateContext;
  return (
    <View style={styles.detail}>
      <NavigationBackAndroid stateNavigator={stateNavigator} />
      <TouchableHighlight
        underlayColor="#fff"
        onPress={() => {
          if (url === stateNavigator.stateContext.url)
            stateNavigator.navigateBack(1);
        }}>
        <Text style={styles.back}>X</Text>
      </TouchableHighlight>
      <View
        onLayout={() => {
          this.el.measure((ox, oy, w, h, x, y) => {
            var {data} = stateNavigator.stateContext;
            moveScene({...data, w, h, x, y});
          });
        }}
        ref={el => this.el = el}
        style={[
          {backgroundColor: color},
          styles.color
        ]} />
      <Text style={styles.text}>{color}</Text>
    </View>
  );
};

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
