import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

export default ({ stateNavigator }) => (
    <View>
        <Text style={styles.home}>Home</Text>
        <TouchableHighlight underlayColor="white" onPress={() => {
            stateNavigator.navigate('tweet');
        }}>
            <Text>Tweet</Text>
        </TouchableHighlight>
    </View>
);

const styles = StyleSheet.create({
  home: {
    fontSize: 50,
    marginTop: 50,
  },
});
