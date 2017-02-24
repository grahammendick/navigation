import React from 'react';
import {StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import {NavigationBackAndroid, spring} from 'navigation-react-native';

export default ({color, colorRef, moveScene, stateNavigator}) => {
  const {url} = stateNavigator.stateContext;
  return (
    <View style={styles.detail}>
      <NavigationBackAndroid stateNavigator={stateNavigator} />
      <TouchableHighlight
        underlayColor="#fff"
        onPress={() => {
          colorRef.measure((ox, oy, w, h, x, y) => {
            if (url === stateNavigator.stateContext.url) {
              stateNavigator.navigateBack(1);
              moveScene({w, h, x, y});
            }
          });
        }}>
        <Text style={styles.back}>X</Text>
      </TouchableHighlight>
      <View
        onLayout={() => {
          this.color.measure((ox, oy, w, h, x, y) => {
            moveScene({w, h, x, y});
          });
        }}
        ref={el => this.color = el}
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
