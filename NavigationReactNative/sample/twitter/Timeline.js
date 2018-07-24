import React from 'react';
import {NavigationContext} from 'navigation-react';
import {StyleSheet, Text, Image, Platform, ScrollView, ToolbarAndroid, View} from 'react-native';
import Tweets from './Tweets';

export default ({timeline: {id, name, username, logo, bio, 
  followers, following, tweets}}) => (
  <NavigationContext.Consumer>
    {({stateNavigator}) => (
      <>
        <ToolbarAndroid
          navIcon={require('./arrow.png')}
          title={name}
          style={styles.toolbar}
          onIconClicked={() => {
            stateNavigator.navigateBack(1)
          }} />
        <ScrollView 
          contentInsetAdjustmentBehavior="automatic" style={styles.view}
          ref={el => this.scrollView = el}>
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
          <Tweets tweets={tweets} onTimeline={accountId => accountId !== id} />
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
    flex: 1,
  },
  logo: {
    width: 100,
    height: 100,
    marginTop: 20,
    borderRadius: 50,
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
