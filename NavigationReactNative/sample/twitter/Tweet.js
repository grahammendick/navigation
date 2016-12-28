import React from 'react';
import {StyleSheet, Text, Image, View, TouchableHighlight} from 'react-native';
import Tweets from './Tweets';

export default ({tweet: {name, username, logo, text, 
  time, retweets, likes, replies}, stateNavigator}) => (
  <View style={styles.view}>
    <TouchableHighlight underlayColor="white" onPress={() => {
      stateNavigator.navigateBack(1);
    }}>
      <Text>Back</Text>
    </TouchableHighlight>
    <View style={styles.detail}>
      <View style={styles.heading}>
        <Image
          style={styles.logo}
          source={{uri: logo}}
        />
        <View style={styles.details}>
          <Text style={styles.name}>{name}</Text>
          <Text>{username}</Text>
        </View>
      </View>
      <Text style={styles.text}>{text}</Text>
      <Text style={styles.time}>{time}</Text>
      <View style={styles.interactions}>
        <Text style={styles.count}>{retweets}</Text>
        <Text style={styles.interaction}>RETWEETS</Text>
        <Text style={styles.count}>{likes}</Text>
        <Text style={styles.interaction}>LIKES</Text>
      </View>
    </View>
    <Tweets tweets={replies} stateNavigator={stateNavigator} />
  </View>
);

const styles = StyleSheet.create({
  view: {
    margin: 20,
  },
  tweet: {
    fontSize: 50,
    marginTop: 50,
  },
  heading: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
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
  time: {
    color: '#657786',
    paddingTop: 12,
    paddingBottom: 10,
    fontSize: 13,
  },
  interactions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ccd6dd',
    paddingTop: 12,
    paddingBottom: 12,
  },
  count: {
    fontWeight: 'bold',
    fontSize: 13,
    marginRight: 5,
  },
  interaction: {
    color: '#657786',
    fontSize: 13,
    marginRight: 10,
  },
});
