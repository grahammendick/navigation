import React from 'react';
import {NavigationContext} from 'navigation-react';
import {StyleSheet, Text, Image, Platform, ScrollView, View, ToolbarAndroid, TouchableHighlight} from 'react-native';
import Tweets from './Tweets';

export default ({tweet: {account: {id: accountId, name, username, logo}, 
  text, time, retweets, likes, replies}}) => (
    <NavigationContext.Consumer>
    {({stateNavigator}) => (
      <>
        <ToolbarAndroid
          navIcon={require('./arrow.png')}
          title="Tweet"
          style={styles.toolbar}
          onIconClicked={() => {
            stateNavigator.navigateBack(1)
          }} />
        <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.view}>
          <View>
            <View style={styles.heading}>
              <TouchableHighlight underlayColor="white" onPress={() => {
                stateNavigator.navigate('timeline', {id: accountId, sceneTitle: name});
              }}>
                <Image style={styles.logo} source={logo} />
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
      </>
    )}
  </NavigationContext.Consumer>
);

const styles = StyleSheet.create({
  toolbar: {
    height: Platform.OS === 'android' ? 50 : 0,
  },
  view: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  heading: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
