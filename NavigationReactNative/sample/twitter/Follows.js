import React from 'react';
import {StyleSheet, Text, Image, ListView, View, TouchableHighlight} from 'react-native';
import Svg, {Path} from 'react-native-svg';

export default ({follows, stateNavigator}) => {
  const {url} = stateNavigator.stateContext;
  const dataSource = new ListView
    .DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    .cloneWithRows(follows);
  return (
    <ListView
        dataSource={dataSource}
        renderRow={({id, name, logo}) => (
        <TouchableHighlight
          underlayColor="white"
          onPress={() => {
            if (url === stateNavigator.stateContext.url)
              stateNavigator.navigate('timeline', {id});
        }}>
          <View style={styles.follow}>
            <Svg
              style={styles.icon}
              height="28"
              width="28"
              viewBox="0 0 46 72">
              <Path
                d="M29.986 9c-14.888 0-27 12.112-27 27s12.112 27 27 27 27-12.112 27-27-12.112-27-27-27zM42.09 47H17.882c-.757 0-.917-.93-.917-2.325 0-.975.325-2.052 1.393-2.616l.033-.022c.706-.429 4.002-1.314 6.945-2.012 1.645 1.861 3.465 2.325 4.651 2.325s3.006-.464 4.65-2.325c2.942.698 6.239 1.583 6.945 2.012.011.007.023.014.033.022 1.068.564 1.393 1.641 1.393 2.616C43.007 46.07 42.847 47 42.09 47zM29.986 23c6.147 0 6.284 6.715 6.284 6.715s.993.044.772 1.86c-.208 1.716-1.307 3.001-2.028 3.001 0 0-1.924 5.003-5.028 5.003s-5.028-5.003-5.028-5.003c-.721 0-1.82-1.285-2.028-3.001-.221-1.815.772-1.86.772-1.86s.347-5.331 3.244-5.677c1.025-.924 2.256-1.038 3.04-1.038z"
                fill="rgb(29, 161, 242)"/>
            </Svg>
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
  );
};

const styles = StyleSheet.create({
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
    borderRadius: 5,
    marginRight: 5,
    marginBottom: 10,
  },
});
