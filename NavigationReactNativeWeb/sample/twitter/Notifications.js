import React, {useContext} from 'react';
import {Platform, StyleSheet, Text, Image, FlatList, View, TouchableHighlight} from 'react-native';
import {NavigationContext} from 'navigation-react';
import {NavigationBar, CoordinatorLayout} from 'navigation-react-native';
import {getFollows} from './data';

export default () => {
  const {stateNavigator} = useContext(NavigationContext);
  return (
    <CoordinatorLayout>
      <NavigationBar
        title="Notifications"
        barTintColor="#fff" />
      <FlatList
        data={getFollows()}
        keyExtractor={item => '' + item.id}
        contentInsetAdjustmentBehavior="automatic"
        style={styles.view}
        renderItem={({item: {id, name, logo}}) => (
          <TouchableHighlight
            underlayColor="white"
            accessibilityRole="link"
            href={stateNavigator.historyManager.getHref(
              stateNavigator.getNavigationLink('timeline', {id})
            )}
            onPress={(e) => {
              if (e.ctrlKey || e.shiftKey || e.metaKey || e.altKey || e.button) return
              e.preventDefault()
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
      )} />
    </CoordinatorLayout>
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
