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
            ref={el => this[color] = el}
            style={[
              {backgroundColor: color},
              styles.color
            ]}
            underlayColor={color}
            onPress={() => {
              this[color].measure((ox, oy, w, h, x, y) => {
                stateNavigator.navigate('detail', {w, h, x, y, color});
              });
            }}>
            <Text></Text>
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
  },
  colors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 50,
  },
  color: {
    width: 100,
    height: 150,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
  },
});
