import React from 'react';
import {StyleSheet, ScrollView, Text, View, TouchableHighlight} from 'react-native';

export default ({stateNavigator}) => (
  <ScrollView>
    <View style={styles.grid}>
      {[...Array(20).keys()].map(item => (
        <TouchableHighlight
          key={item}
          style={styles.item}
          underlayColor="#fff"
          onPress={() => {
            stateNavigator.navigate('detail');
          }}>
          <Text style={styles.text}>{item}</Text>
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
  item: {
    width: 100,
    height: 150,
    backgroundColor: 'red',
    padding: 10,
    margin: 10,
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  }
});
