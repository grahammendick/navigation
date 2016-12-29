import React from 'react';
import {StyleSheet, Text, Image, View, TouchableHighlight} from 'react-native';
import BackIcon from './BackIcon';
import Tweets from './Tweets';

export default ({timeline: {name, username, logo, bio, 
  followers, following, tweets}, stateNavigator}) => (
  <View style={styles.view}>
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
      <Text style={styles.title}>{name}</Text>
    </View>
    <View>
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
    marginLeft: 20,
    marginRight: 20,
  },
  banner: {
    paddingTop: 40,
    paddingBottom: 40,
    flexDirection: 'row',
  },
  back: {
    marginTop: -6,
    width: 40,
  },
  title: {
    fontWeight: 'bold',
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
