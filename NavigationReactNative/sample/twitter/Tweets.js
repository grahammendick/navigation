import React from 'react';
import {StyleSheet, Text, Image, View, ListView, TouchableHighlight} from 'react-native';

export default class Tweets extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.url = props.stateNavigator.stateContext.url;
  }
  shouldComponentUpdate(props) {
    return this.url === props.stateNavigator.stateContext.url;
  }
  render() {
    const {tweets, onTimeline, stateNavigator} = this.props;
    const dataSource = new ListView
      .DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
      .cloneWithRows(tweets);
    return (
      <ListView
        dataSource={dataSource}
        renderRow={({account: {id: accountId, name, logo}, id, text}) => (
          <TouchableHighlight
            underlayColor="white"
            onPress={() => {
              if (this.url === stateNavigator.stateContext.url)
                stateNavigator.navigate('tweet', {id});
          }}>
            <View style={styles.tweet}>
              <TouchableHighlight
                underlayColor="white"
                onPress={() => {
                  if ((!onTimeline || onTimeline(accountId))
                    && this.url === stateNavigator.stateContext.url) {
                    stateNavigator.navigate('timeline', {id: accountId});
                  }
              }}>
                <Image style={styles.logo} source={logo} />
              </TouchableHighlight>
              <View style={styles.details}>
                <Text style={styles.name}>{name}</Text>
                <Text>{text}</Text>
              </View>
            </View>
          </TouchableHighlight>
        )} />
    );
  }
};

const styles = StyleSheet.create({
  tweet: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomColor: '#ccd6dd',
    borderBottomWidth: 1,
  },
  details: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 8,
  },
});
