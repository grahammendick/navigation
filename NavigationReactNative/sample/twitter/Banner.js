import React from 'react';
import {StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import Svg, {Path} from 'react-native-svg';

export default ({title, stateNavigator}) => (
  <View style={styles.banner}>
    <TouchableHighlight
      underlayColor="white"
      style={styles.back}
      onPress={() => {
        stateNavigator.navigateBack(1);
    }}>
      <View>
        <Svg
          height="30"
          width="30"
          viewBox="0 0 46 72">
          <Path
            d="M40 33H15.243l7.878-7.879a2.998 2.998 0 0 0 0-4.242 2.998 2.998 0 0 0-4.242 0l-13 13a2.998 2.998 0 0 0 0 4.242l13 13c.585.586 1.353.879 2.121.879s1.536-.293 2.121-.879a2.998 2.998 0 0 0 0-4.242L15.243 39H40a3 3 0 1 0 0-6z"
            fill="rgb(29, 161, 242)"/>
        </Svg>
      </View>
    </TouchableHighlight>
    <Text style={styles.title}>{title}</Text>
  </View>    
);

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    paddingTop: 30,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderColor: '#ccd6dd',
  },
  back: {
    marginTop: -6,
    marginLeft: 10,
    width: 40,
  },
  title: {
    fontWeight: 'bold',
  },
});
