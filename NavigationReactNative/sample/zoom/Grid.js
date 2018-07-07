import React from 'react';
import {Platform, StyleSheet, ScrollView, Text, View, TouchableHighlight} from 'react-native';
import {NavigationContext} from 'navigation-react';

const colors = [
  'maroon', 'red', 'crimson', 'orange', 'brown', 'sienna', 'olive',
  'purple', 'fuchsia', 'indigo', 'green', 'navy', 'blue', 'teal', 'black'
];

export default () => (
  <NavigationContext>
    {({stateNavigator}) => (
      <View style={styles.grid}>
        <ScrollView>
          <View style={styles.colors}>
            {colors.map(color => (
              <TouchableHighlight
                style={[
                  {backgroundColor: color},
                  styles.color
                ]}
                underlayColor={color}
                key={color}
                onPress={() => {
                  stateNavigator.navigate('detail', {color});
                }}>
                <Text style={styles.text}>{color}</Text>
              </TouchableHighlight>
            ))}
          </View>
        </ScrollView>
      </View>
    )}
  </NavigationContext>
);

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: Platform.OS === 'ios' ? 50 : 0,
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
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  }
});