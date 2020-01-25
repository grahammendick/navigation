import React, {useContext} from 'react';
import {StyleSheet, Text, Image, Platform, ScrollView, View} from 'react-native';
import {NavigationContext} from 'navigation-react';
import {NavigationBar, CoordinatorLayout, CollapsingBar} from 'navigation-react-native';
import Tweets from './Tweets';

export default ({timeline: {id, name, username, logo, bio, 
  followers, following, tweets}}) => {
  const {stateNavigator} = useContext(NavigationContext);
  return (
    <CoordinatorLayout>
      <NavigationBar
        title={name}
        navigationImage={require('./arrow.png')}
        barTintColor={Platform.OS === 'android' ? '#fff' : null}
        tintColor={Platform.OS === 'android' ? "deepskyblue" : null}
        style={{height: 200}}
        onNavigationPress={() => {
          stateNavigator.navigateBack(1)
        }}>
        <CollapsingBar>
          <View collapsable={false}>
            <Image style={styles.logo} source={logo} />
          </View>
        </CollapsingBar>
      </NavigationBar>
      <ScrollView
        nestedScrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic"
        style={styles.view}>
        <View>
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
    </CoordinatorLayout>
  );
};

const styles = StyleSheet.create({
  view: {
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
  },
  logo: {
    width: 75,
    height: 75,
    borderRadius: 50,
    marginTop: 60,
    marginLeft: 15,
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
