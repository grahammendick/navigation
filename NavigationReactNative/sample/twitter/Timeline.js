import React from 'react';
import {StyleSheet, Text, Image, View, TouchableHighlight} from 'react-native';
import Tweets from './Tweets';

export default ({timeline: {name, username, logo, bio, 
  followers, following, tweets}, stateNavigator}) => (
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
      <Text style={styles.bio}>{bio}</Text>
    </View>
    <View style={styles.interactions}>
      <Text style={styles.count}>{following.toLocaleString()}</Text>
      <Text style={styles.interaction}>FOLLOWING</Text>
      <Text style={styles.count}>{followers.toLocaleString()}</Text>
      <Text style={styles.interaction}>FOLLOWERS</Text>
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
