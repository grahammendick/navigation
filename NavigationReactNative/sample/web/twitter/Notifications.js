import React, {useContext} from 'react';
import {ScrollView, StyleSheet, Text, Image, FlatList, View, TouchableHighlight, SafeAreaView} from 'react-native';
import {NavigationContext} from 'navigation-react';
import {NavigationBar} from 'navigation-react-native';

export default ({follows}) => {
  const {stateNavigator} = useContext(NavigationContext);
  return (
    <>
      <NavigationBar title="Notifications" barTintColor={Platform.OS === 'android' ? '#fff' : null} />
      <SafeAreaView style={{flex: 1}}>
        <FlatList
          data={follows}
          keyExtractor={item => '' + item.id}
          style={styles.view}
          renderItem={({item: {id, name, logo}}) => (
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
        )} />
      </SafeAreaView>
    </>
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
