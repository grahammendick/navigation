import React from 'react';
import {StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import {NavigationBackAndroid} from 'navigation-react-native';

const nextDirection = {
  North: 'East',
  East: 'South',
  South: 'West',
  West: 'North',
};

export default ({direction, color, stateNavigator}) => {
  const {url, crumbs} = stateNavigator.stateContext;
  return (
    <View style={[
      styles.scene,
      {backgroundColor: color}
    ]}>
      <NavigationBackAndroid stateNavigator={stateNavigator} />
      <TouchableHighlight
        underlayColor={color}
        onPress={() => {
          if (url === stateNavigator.stateContext.url)
            stateNavigator.navigate(`scene${nextDirection[direction]}`);
      }}>
        <Text style={styles.text}>{direction} {crumbs.length}</Text>
      </TouchableHighlight>
      {stateNavigator.canNavigateBack(1) && <TouchableHighlight
        underlayColor={color}
        onPress={() => {
          if (url === stateNavigator.stateContext.url)
            stateNavigator.navigateBack(1);
      }}>
        <Text style={styles.text}>Back</Text>
      </TouchableHighlight>}
    </View>
  )
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
});
