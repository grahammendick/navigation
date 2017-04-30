import React from 'react';
import {StyleSheet, Text, Image, ScrollView, View, TouchableHighlight} from 'react-native';
import {NavigationBackAndroid} from 'navigation-react-native';
import Banner from './Banner';
import Tweets from './Tweets';

export default class Tweet extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.url = props.stateNavigator.stateContext.url;
  }
  shouldComponentUpdate(props) {
    return this.url === props.stateNavigator.stateContext.url;
  }
  render(){
    const {tweet: {account: {id: accountId, name, username, logo}, 
      text, time, retweets, likes, replies}, stateNavigator} = this.props;
    return (
      <View style={{flex: 1}}>
        <NavigationBackAndroid stateNavigator={stateNavigator} />
        <Banner title="Tweet" stateNavigator={stateNavigator} />
        <ScrollView style={styles.view}>
          <View>
            <View style={styles.heading}>
              <TouchableHighlight underlayColor="white" onPress={() => {
                if (this.url === stateNavigator.stateContext.url)
                  stateNavigator.navigate('timeline', {id: accountId});
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
  heading: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 8,
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
