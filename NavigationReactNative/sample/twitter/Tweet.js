import React from 'react';
import {StyleSheet, Text, Image, View, ListView, TouchableHighlight} from 'react-native';

export default ({tweet: {name, replies}, stateNavigator}) => {
  const dataSource = new ListView
    .DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    .cloneWithRows(replies);
  return (
    <View style={styles.view}>
      <TouchableHighlight underlayColor="white" onPress={() => {
        stateNavigator.navigateBack(1);
      }}>
        <Text>Back</Text>
      </TouchableHighlight>
      <Text style={styles.title}>Tweet</Text>
      <ListView
        dataSource={dataSource}
        renderRow={reply => (
          <Reply
            {...reply}
            stateNavigator={stateNavigator} />
        )} />
    </View>
  );
};


const Reply = ({id, name, logo, text, stateNavigator}) => (
  <TouchableHighlight
    underlayColor="white"
    onPress={() => {
      stateNavigator.navigate('tweet', {id});
  }}>
    <View style={styles.tweet}>
      <Image
        style={styles.logo}
        source={{uri: logo}}
      />
      <View style={styles.details}>
        <Text style={styles.name}>{name}</Text>
        <Text>{text}</Text>
      </View>
    </View>
  </TouchableHighlight>
);


const styles = StyleSheet.create({
  view: {
    margin: 20,
  },
  title: {
    fontSize: 50,
    marginTop: 50,
  },
  tweet: {
    flexDirection: 'row',
    padding: 10,
    borderBottomColor: '#ccd6dd',
    borderBottomWidth: 1,
  },
  details: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 8,
  },
});
