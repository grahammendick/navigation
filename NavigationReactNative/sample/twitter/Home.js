import React from 'react';
import { StyleSheet, Text, View, ListView, TouchableHighlight } from 'react-native';

export default ({ tweets, stateNavigator }) => {
  const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  const dataSource = ds.cloneWithRows(tweets);
  return (
    <View style={styles.view}>
      <Text style={styles.home}>Home</Text>
      <TouchableHighlight underlayColor="white" onPress={() => {
        stateNavigator.navigate('tweet');
      } }>
        <Text>Tweet</Text>
      </TouchableHighlight>
      <ListView
        dataSource={dataSource}
        renderRow={rowData => <Text>{rowData.name}</Text>} />
    </View>);
};

const styles = StyleSheet.create({
  view: {
    margin: 25,
  },
  home: {
    paddingTop: 10,
    fontSize: 50,
    marginTop: 50,
  },
});
