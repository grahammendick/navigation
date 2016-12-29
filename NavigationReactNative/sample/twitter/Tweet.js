import React from 'react';
import {StyleSheet, Text, Image, ScrollView, View, TouchableHighlight} from 'react-native';
import BackIcon from './BackIcon';
import Tweets from './Tweets';

export default ({tweet: {account: {id: accountId, name, username, logo}, 
  text, time, retweets, likes, replies}, stateNavigator}) => (
  <View>
    <View style={styles.banner}>
      <TouchableHighlight
        underlayColor="white"
        style={styles.back}
        onPress={() => {
          stateNavigator.navigateBack(1);
      }}>
        <View>
          <BackIcon />
        </View>
      </TouchableHighlight>
      <Text style={styles.title}>Tweet</Text>
    </View>
    <ScrollView style={styles.view}>
      <View>
        <View style={styles.heading}>
          <TouchableHighlight underlayColor="white" onPress={() => {
              stateNavigator.navigate('timeline', {id: accountId});
          }}>
            <Image
              style={styles.logo}
              source={logo}
            />
          </TouchableHighlight>
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
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  view: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  banner: {
    flexDirection: 'row',
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderColor: '#ccd6dd',
  },
  back: {
    marginTop: -6,
    marginLeft: 10,
    width: 40,
  },
  title: {
    fontWeight: 'bold',
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
