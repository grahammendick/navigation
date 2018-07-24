import React from 'react';
import {NavigationContext} from 'navigation-react';
import {StyleSheet, Text, Image, View, FlatList, TouchableHighlight} from 'react-native';

export default ({tweets, onTimeline}) => (
  <NavigationContext.Consumer>
    {({stateNavigator}) => (
      <FlatList
        data={tweets}
        keyExtractor={item => '' + item.id}
        renderItem={({item: {account: {id: accountId, name, logo}, id, text}}) => (
          <TouchableHighlight
            underlayColor="white"
            onPress={() => {
              stateNavigator.navigate('tweet', {id});
          }}>
            <View style={styles.tweet}>
              <TouchableHighlight
                underlayColor="white"
                onPress={() => {
                  if (!onTimeline || onTimeline(accountId))
                    stateNavigator.navigate('timeline', {id: accountId, sceneTitle: name});
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
    )}
  </NavigationContext.Consumer>
);

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
    borderRadius: 25,
    marginRight: 8,
  },
});
