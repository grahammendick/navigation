import React from 'react';
import {StyleSheet, ScrollView, Text, View, TouchableHighlight} from 'react-native';
import colors from './colors';

export default ({stateNavigator}) => (
  <ScrollView>
    <View style={styles.grid}>
      {colors().map(color => (
        <TouchableHighlight
          key={color}
          style={[
            {backgroundColor: color},
            styles.color
          ]}
          underlayColor={color}
          onPress={() => {
            stateNavigator.navigate('detail');
          }}>
          <Text style={styles.text}>{color}</Text>
        </TouchableHighlight>
      ))}
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  grid: {
    marginTop: 50,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  color: {
    width: 100,
    height: 150,
    padding: 10,
    margin: 10,
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  }
});
