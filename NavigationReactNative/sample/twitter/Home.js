import React from 'react';
import { StyleSheet, Text, Image, View, ListView, TouchableHighlight } from 'react-native';

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
        renderRow={tweet => <Row {...tweet} stateNavigator={stateNavigator} />} />
    </View>);
};

const Row = ({ id, name, logo, text, stateNavigator }) => (
  <TouchableHighlight underlayColor="white" onPress={() => {
    stateNavigator.navigate('tweet', { id: id });
  } }>
    <View>
      <Text>{name}</Text>
      <Image
        style={styles.logo}
        source={{uri: logo}}
      />
      <Text>{text}</Text>
    </View>
  </TouchableHighlight>
);

const styles = StyleSheet.create({
  view: {
    margin: 25,
  },
  home: {
    paddingTop: 10,
    fontSize: 50,
    marginTop: 50,
  },
  logo: {
    width: 50,
    height: 50,
  },
});
