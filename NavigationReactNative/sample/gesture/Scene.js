import React from 'react';
import {StyleSheet, Text, View, TouchableHighlight} from 'react-native';

export default ({name, stateNavigator}) => {
  const {url} = stateNavigator.stateContext;
  return (
    <View style={styles.scene}>
      <TouchableHighlight
        underlayColor="white"
        onPress={() => {
          if (url === stateNavigator.stateContext.url)
            stateNavigator.navigate('sceneTwo');
      }}>
        <Text>{name}</Text>
      </TouchableHighlight>
    </View>
  )
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
