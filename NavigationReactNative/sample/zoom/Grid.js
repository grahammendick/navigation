import React from 'react';
import {StyleSheet, ScrollView, Text, View, TouchableHighlight} from 'react-native';

const colors = ['maroon', 'red', 'crimson', 'orange', 'brown',
  'sienna', 'olive', 'purple', 'fuchsia', 'indigo',
  'green', 'navy', 'blue', 'teal', 'black'];

export default ({stateNavigator}) => (
  <View style={styles.grid}>
    <ScrollView>
      <View style={styles.colors}>
        {colors.map(color => (
          <TouchableHighlight
            key={color}
            style={[
              {backgroundColor: color},
              styles.color
            ]}
            underlayColor={color}
            onPress={() => {
              stateNavigator.navigate('detail', {color: color});
            }}>
            <Text style={styles.text}>{color}</Text>
          </TouchableHighlight>
        ))}
      </View>
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50,
  },
  colors: {
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
