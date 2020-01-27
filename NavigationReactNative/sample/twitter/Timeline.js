import React, {useContext, useState} from 'react';
import {StyleSheet, Text, Image, Platform, ScrollView, View, Animated} from 'react-native';
import {NavigationContext} from 'navigation-react';
import {NavigationBar, CoordinatorLayout, CollapsingBar} from 'navigation-react-native';
import Tweets from './Tweets';

export default ({timeline: {id, name, username, logo, bio, 
  colors, followers, following, tweets}}) => {
  const {stateNavigator} = useContext(NavigationContext);
  const [offset] = useState(new Animated.Value(0));
  const diameter = offset.interpolate({
    inputRange:  [-64, 0],
    outputRange: [60, 80],
  })
  return (
    <CoordinatorLayout overlap={110}>
      <NavigationBar
        title={name}
        onOffsetChanged={Animated.event([{nativeEvent:{offset}}])}
        navigationImage={require('./arrow.png')}
        barTintColor={Platform.OS === 'android' ? colors[0] : null}
        tintColor={Platform.OS === 'android' ? "#fff" : null}
        titleColor={Platform.OS === 'android' ? "#fff" : null}
        style={{height: 120}}
        onNavigationPress={() => {
          stateNavigator.navigateBack(1)
        }}>
        <CollapsingBar>
          <View style={{backgroundColor: colors[1]}} />
        </CollapsingBar>
      </NavigationBar>
      <ScrollView
        nestedScrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic"
        style={styles.view}>
        <View>
          <Animated.Image
            source={logo}
            style={[styles.logo, {width: diameter, height: diameter}]} />
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
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'white',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 24, 
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
