import React, {useContext} from 'react';
import {StyleSheet, SafeAreaView, Text, Image, FlatList, View, TouchableHighlight} from 'react-native';
import {NavigationContext} from 'navigation-react';
import {NavigationBar, TabBar, TabBarItem} from 'navigation-react-native';

const Follow = ({account: {id, name, logo}}) => {
  const {stateNavigator} = useContext(NavigationContext);
  return (
    <TouchableHighlight
      underlayColor="white"
      onPress={() => {
        stateNavigator.navigate('timeline', {id});
      }}>
      <View style={styles.follow}>
        <View>
          <Image style={styles.logo} source={logo} />
          <View style={styles.details}>
          <Text style={styles.name}>{name}</Text>
          <Text>followed you.</Text>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
}

const Tweet = ({id, account: {id: accountId, name, logo}, text}) => {
  const {stateNavigator} = useContext(NavigationContext);
  return (
    <TouchableHighlight
      underlayColor="white"
      onPress={() => {
        stateNavigator.navigate('tweet', {id});
      }}>
      <View style={styles.tweet}>
        <TouchableHighlight
          underlayColor="white"
          onPress={() => {
            stateNavigator.navigate('timeline', {id: accountId});
        }}>
          <Image style={styles.tweet_logo} source={logo} />
        </TouchableHighlight>
        <View style={styles.tweet_details}>
          <Text style={styles.tweet_name}>{name}</Text>
          <Text>{text}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
}

export default ({notifications}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <NavigationBar title="Notifications" barTintColor={Platform.OS === 'android' ? '#fff' : null} />
      <TabBar segmented={true}>
        <TabBarItem title="All">
          <FlatList
              data={notifications}
              keyExtractor={(_item, index) => '' + index}
              contentInsetAdjustmentBehavior="automatic"
              style={styles.view}
              renderItem={({item}) => (
                item.follow ? <Follow {...item} /> : <Tweet {...item} />
              )} />
        </TabBarItem>
      </TabBar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: {
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#fff',
  },
  follow: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomColor: '#ccd6dd',
    borderBottomWidth: 1,
  },
  icon: {
    marginRight: 10,
  },
  details: {
    flexDirection: 'row',
  },
  name: {
    fontWeight: 'bold',
    paddingRight: 4,
  },
  logo: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 5,
    marginBottom: 10,
  },
  tweet: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomColor: '#ccd6dd',
    borderBottomWidth: 1,
  },
  tweet_details: {
    flex: 1,
  },
  tweet_name: {
    fontWeight: 'bold',
  },
  tweet_logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 8,
  },
});
