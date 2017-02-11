import React from 'react';
import {StyleSheet, ScrollView, Text, View, TouchableHighlight} from 'react-native';
import {spring} from 'navigation-react-native';

export default ({color, moveScene, stateNavigator}) => (
  <View style={styles.detail}>
    <TouchableHighlight
      underlayColor="#fff"
      onPress={() => {
        stateNavigator.navigateBack(1);
      }}>
      <Text style={styles.back}>X</Text>
    </TouchableHighlight>
    <View
      onLayout={() => {
        this.el.measure((ox, oy, w, h, x, y) => {
          moveScene({
            w: spring(w),
            h: spring(h),
            x: spring(x),
            y: spring(y),
            show: spring(1)
          });
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
    marginLeft: 20,
    marginRight: 20,
  },
  text:{
    flex: .4,
    fontSize: 80,
    color: '#000',
    textAlign:'center',
    fontWeight: 'bold',
  },
});
