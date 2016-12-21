import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

export default ({ stateNavigator }) => (
    <View>
        <Text style={styles.tweet}>Tweet</Text>
        <TouchableHighlight underlayColor="white" onPress={() => {
            stateNavigator.navigateBack(1);
        }}>
            <Text>Back</Text>
        </TouchableHighlight>
    </View>
);

const styles = StyleSheet.create({
  tweet: {
    fontSize: 50,
    marginTop: 50,
  },
});
