import React, {useContext, useState} from 'react';
import {StyleSheet, Text, Platform, View, Animated} from 'react-native';
import {NavigationContext} from 'navigation-react';
import {NavigationBar, CoordinatorLayout, CollapsingBar} from 'navigation-react-native';
import Tweets from './Tweets';
import {getTimeline} from './data';

export default () => {
  const {stateNavigator, data} = useContext(NavigationContext);
  const {id, name, username, logo, bio,
    colors, followers, following, tweets} = getTimeline(data.id);
  const [offset] = useState(new Animated.Value(0));
  const scale = offset.interpolate({
    inputRange:  [-64, 0],
    outputRange: [.8, 1],
  });
  return (
    <CoordinatorLayout overlap={110}>
      <NavigationBar
        title={name}
        onOffsetChanged={Animated.event([{nativeEvent:{offset}}], {useNativeDriver: true})}
        barTintColor={Platform.OS === 'android' ? standard => standard ? colors[0] : colors[1] : 'rgb(247,247,247)'}
        tintColor={Platform.OS === 'android' ? "#fff" : null}
        titleColor={Platform.OS === 'android' ? "#fff" : null}
        style={{height: 140}}>
        <CollapsingBar />
      </NavigationBar>
      <Tweets
        tweets={tweets}
        renderHeader={(
          <>
            <View>
              <Animated.Image
                source={logo}
                style={[styles.logo, {transform: [{scale}]}]} />
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
          </>
        )}
        onTimeline={accountId => accountId !== id} />
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
    width: 85,
    height: 85,
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
