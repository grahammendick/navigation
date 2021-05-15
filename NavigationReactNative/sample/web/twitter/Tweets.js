import React, {useContext} from 'react';
import {NavigationContext} from 'navigation-react';
import {StyleSheet, Text, Image, View, FlatList, TouchableHighlight} from 'react-native';

export default ({renderHeader, tweets, onTimeline}) => {
  const {stateNavigator} = useContext(NavigationContext);
  return (
    <FlatList
      data={tweets}
      keyExtractor={item => '' + item.id}
      contentInsetAdjustmentBehavior="automatic"
      nestedScrollEnabled={true}
      ListHeaderComponent={renderHeader}
      style={styles.view}
      renderItem={({item: {account: {id: accountId, name, logo}, id, text}}) => (
        <View style={styles.tweet}>
          <TouchableHighlight
            underlayColor="white"
            accessibilityRole={!onTimeline || onTimeline(accountId) ? 'link' : undefined}
            href={stateNavigator.historyManager.getHref(
              stateNavigator.getNavigationLink('timeline', {id: accountId})
            )}
            onPress={(e) => {
              if (e.ctrlKey || e.shiftKey || e.metaKey || e.altKey || e.button) return
              e.preventDefault()
              if (!onTimeline || onTimeline(accountId))
                stateNavigator.navigate('timeline', {id: accountId});
          }}>
            <Image style={styles.logo} source={logo} />
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor="white"
            style={styles.details}
            accessibilityRole="link"
            href={stateNavigator.historyManager.getHref(
              stateNavigator.getNavigationLink('tweet', {id})
            )}
            onPress={(e) => {
              if (e.ctrlKey || e.shiftKey || e.metaKey || e.altKey || e.button) return
              e.preventDefault()
              stateNavigator.navigate('tweet', {id});
          }}>
          <View>
            <Text style={styles.name}>{name}</Text>
            <Text>{text}</Text>
          </View>
        </TouchableHighlight>
      </View>
    )} />
  );
};

const styles = StyleSheet.create({
  view: {
    paddingLeft: 20,
    paddingRight: 20,
  },
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
