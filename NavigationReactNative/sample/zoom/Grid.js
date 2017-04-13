import React from 'react';
import {StyleSheet, ScrollView, Text, View, TouchableHighlight} from 'react-native';
import SharedElement from './SharedElement';

const colors = [
  'maroon', 'red', 'crimson', 'orange', 'brown', 'sienna', 'olive',
  'purple', 'fuchsia', 'indigo', 'green', 'navy', 'blue', 'teal', 'black'
];

export default ({stateNavigator}) => {
  const {url} = stateNavigator.stateContext;
  return (
    <View style={styles.grid}>
      <ScrollView>
        <View style={styles.colors}>
          {colors.map(color => (
            <SharedElement
              key={color}
              name={color}
              data={{color}}
              stateNavigator={stateNavigator}>
              <TouchableHighlight
                style={[
                  {backgroundColor: color},
                  styles.color
                ]}
                underlayColor={color}
                onPress={() => {
                  if (url === stateNavigator.stateContext.url) {
                    stateNavigator.navigate('detail', {color});
                  }
                }}>
                <Text></Text>
              </TouchableHighlight>
            </SharedElement>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

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