import React from 'react';
import {StyleSheet, Text, Image, ScrollView, View, TouchableHighlight} from 'react-native';
import Banner from './Banner';
import Tweets from './Tweets';

export default ({timeline: {name, username, logo, bio, 
  followers, following, tweets}, stateNavigator}) => (
  <View>
    <Banner title={name} stateNavigator={stateNavigator} />
    <ScrollView style={styles.view}>
      <View>
        <Image style={styles.logo} source={logo} />
        <Text style={styles.name}>{name}</Text>
        <Text>{username}</Text>
        <Text style={styles.bio}>{bio}</Text>
      </View>
      <View style={styles.interactions}>
        <Text style={styles.count}>{following.toLocaleString()}</Text>
        <Text style={styles.interaction}>FOLLOWING</Text>
        <Text style={styles.count}>{followers.toLocaleString()}</Text>
        <Text style={styles.interaction}>FOLLOWERS</Text>
      </View>
      <Tweets tweets={tweets} stateNavigator={stateNavigator} />
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  view: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18, 
    marginTop: 5,
    marginBottom: 2,
  },
  bio: {
    marginTop: 10, 
    marginBottom: 10, 
  },
  interactions: {
    flexDirection: 'row',
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
