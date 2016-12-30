import React from 'react';
import {StyleSheet, Text, Image, ListView, ScrollView, View, TouchableHighlight} from 'react-native';

export default ({notifications, stateNavigator}) => {
  const dataSource = new ListView
    .DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    .cloneWithRows(notifications);
  return (
    <View>
      <View style={styles.banner}>
        <Text style={styles.title}>Notifications</Text>
      </View>
      <ScrollView style={styles.view}>
        <ListView
          dataSource={dataSource}
          renderRow={({id, name, logo}) => (
            <TouchableHighlight
              underlayColor="white"
              onPress={() => {
                stateNavigator.navigate('timeline', {id});
            }}>
              <View style={styles.notification}>
                <Image style={styles.logo} source={logo} />
                <View style={styles.details}>
                  <Text style={styles.name}>{name}</Text>
                  <Text>followed you.</Text>
                </View>
              </View>
            </TouchableHighlight>
          )} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    paddingTop: 35,
    paddingLeft: 50,
    paddingBottom: 22,
    borderBottomWidth: 2,
    borderColor: '#ccd6dd',
  },
  title: {
    fontWeight: 'bold',
  },
  view: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
  },
  notification: {
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomColor: '#ccd6dd',
    borderBottomWidth: 1,
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
    borderRadius: 5,
    marginRight: 5,
    marginBottom: 10,
  },
});
