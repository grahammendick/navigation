import React from 'react';
import {StyleSheet, Text, Image, View, ListView, TouchableHighlight} from 'react-native';

export default ({tweets, stateNavigator}) => {
  const dataSource = new ListView
    .DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    .cloneWithRows(tweets);
  return (
    <ListView
      dataSource={dataSource}
      renderRow={({account: {id: accountId, name, logo}, id, text}) => (
        <TouchableHighlight
          underlayColor="white"
          onPress={() => {
            stateNavigator.navigate('tweet', {id});
        }}>
          <View style={styles.tweet}>
            <TouchableHighlight
              underlayColor="white"
              onPress={() => {
                stateNavigator.navigate('timeline', {id: accountId});
            }}>
              <Image
                style={styles.logo}
                source={logo}
              />
            </TouchableHighlight>
            <View style={styles.details}>
              <Text style={styles.name}>{name}</Text>
              <Text>{text}</Text>
            </View>
          </View>
        </TouchableHighlight>
      )} />
  );
};

const styles = StyleSheet.create({
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
