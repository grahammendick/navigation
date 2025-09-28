import React, {useContext} from 'react';
import {StyleSheet, Text, Image, FlatList, View, TouchableHighlight, Platform} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context'
import {NavigationContext} from 'navigation-react';
import {CoordinatorLayout, NavigationBar, TabBar, TabBarItem} from 'navigation-react-native';
import TweetItem from './TweetItem';
import {getNotifications} from './data';

const Container = ({children}) => (
  Platform.OS === 'ios' ? (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1}} edges={+Platform.Version >= 26 ? ['top'] : ['top', 'bottom']}>{children}</SafeAreaView>
    </SafeAreaProvider>
   ) : children
);

export default () => {
  const {stateNavigator} = useContext(NavigationContext);
  const notifications = getNotifications();
  return (
    <Container>
      <CoordinatorLayout>
        <NavigationBar
          title="Notifications"
          barTintColor={Platform.OS === 'android' ? 'rgba(255,255,255, 0)' : null}>
          <TabBar selectedTintColor="#1da1f2" />
        </NavigationBar>
        <TabBar primary={false}>
          <TabBarItem title="All">
            <FlatList
              data={notifications}
              keyExtractor={(_item, index) => '' + index}
              nestedScrollEnabled={true}
              style={styles.view}
              renderItem={({item: {account: {id, name, logo}}, item}) => (
                item.follow ? (
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
                ) : <TweetItem {...item} />
              )} />
          </TabBarItem>
          <TabBarItem title="Mentions">
            <FlatList
              data={notifications.filter(({mention}) => mention)}
              keyExtractor={(_item, index) => '' + index}
              nestedScrollEnabled={true}
              style={styles.view}
              renderItem={({item}) => <TweetItem {...item} />} />
          </TabBarItem>
        </TabBar>
      </CoordinatorLayout>
    </Container>
  );
};

const styles = StyleSheet.create({
  view: {
    paddingLeft: 20,
    paddingRight: 20,
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
});
