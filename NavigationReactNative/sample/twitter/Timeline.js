import React from 'react';
import {StyleSheet, Text, Image, ScrollView, View, TouchableHighlight} from 'react-native';
import {NavigationBackAndroid} from 'navigation-react-native';
import Banner from './Banner';
import Tweets from './Tweets';

export default class Timeline extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.url = props.stateNavigator.stateContext.url;
  }
  shouldComponentUpdate(props) {
    return this.url === props.stateNavigator.stateContext.url;
  }
  render() {
    const {timeline: {id, name, username, logo, bio, 
      followers, following, tweets}, stateNavigator} = this.props;
    return (
      <View style={{flex: 1}}>
        <NavigationBackAndroid stateNavigator={stateNavigator} />
        <Banner title={name} stateNavigator={stateNavigator} />
        <ScrollView ref={el => {if (el) this.scrollView = el}} style={styles.view}>
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
          <Tweets
            tweets={tweets}
            onTimeline={accountId => {
              if (accountId === id)
                this.scrollView.scrollTo({y: 0});
              return accountId !== id;
            }}
            stateNavigator={stateNavigator} />
        </ScrollView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  view: {
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
  },
  logo: {
    width: 100,
    height: 100,
    marginTop: 20,
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
