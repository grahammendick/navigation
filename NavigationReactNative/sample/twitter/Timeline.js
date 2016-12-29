import React from 'react';
import {StyleSheet, Text, Image, View, TouchableHighlight} from 'react-native';
import Tweets from './Tweets';

export default ({timeline: {name, username, logo, tweets}, stateNavigator}) => (
  <View style={styles.view}>
    <TouchableHighlight underlayColor="white" onPress={() => {
      stateNavigator.navigateBack(1);
    }}>
      <Text>Back</Text>
    </TouchableHighlight>
    <View style={styles.heading}>
      <Image
        style={styles.logo}
        source={{uri: logo}}
      />
      <Text style={styles.name}>{name}</Text>
      <Text>{username}</Text>
    </View>
    <Tweets tweets={tweets} stateNavigator={stateNavigator} />
  </View>
);

const styles = StyleSheet.create({
  view: {
    margin: 20,
  },
  heading: {
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  name: {
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 2,
  },
  text: {
    fontSize: 18, 
  },
});
