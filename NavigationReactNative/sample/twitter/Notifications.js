import React from 'react';
import {NavigationContext} from 'navigation-react';
import {ScrollView, StyleSheet, Text, Image, FlatList, View, TouchableHighlight} from 'react-native';

export default ({follows}) => (
  <NavigationContext.Consumer>
    {({stateNavigator}) => (
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.view}>
          <FlatList
              data={follows}
              keyExtractor={item => '' + item.id}
              renderItem={({item: {id, name, logo}}) => (
              <TouchableHighlight
                underlayColor="white"
                onPress={() => {
                  stateNavigator.navigate('timeline', {id, sceneTitle: name});
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
      </ScrollView>
    )}
  </NavigationContext.Consumer>
);

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
