import React, {useContext, useState} from 'react';
import {StyleSheet, Text, Platform, View, Animated} from 'react-native';
import {NavigationContext} from 'navigation-react';
import {NavigationBar, CoordinatorLayout, CollapsingBar, useNavigated} from 'navigation-react-native';
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
  useNavigated(() => {
    if (Platform.OS === 'web') document.title = name;
  });
  return (
    <CoordinatorLayout overlap={110}>
      <NavigationBar
        title={name}
        onOffsetChanged={Animated.event([{nativeEvent:{offset}}], {useNativeDriver: Platform.OS !== 'web'})}
        navigationImage={require('./arrow.png')}
        barTintColor={Platform.OS === 'android' ? colors[0] : '#fff'}
        tintColor={Platform.OS === 'android' ? "#fff" : (Platform.OS !== 'web' ? null : 'deepskyblue')}
        titleColor={Platform.OS === 'android' ? "#fff" : null}
        navigationHref={stateNavigator.historyManager.getHref(
          stateNavigator.getNavigationBackLink(1)
        )}
        style={{height: 140}}
        onNavigationPress={() => stateNavigator.navigateBack(1)}>
        <CollapsingBar>
          <View style={{backgroundColor: colors[1], flex: 1}} />
        </CollapsingBar>
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
