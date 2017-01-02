import React from 'react';
import {StyleSheet, TouchableHighlight, Text, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';

export default ({activeTab, onTimeline, onNotifications}) => (
  <View style={styles.footer}>
    <TouchableHighlight
      underlayColor="white"
      style={styles.tab}
      onPress={onTimeline}>
      <View>
        <Svg
          style={styles.timelineIcon}
          viewBox="0 0 64 72">
          <Path
            d="M60.034 33.795l-26-23.984a2.997 2.997 0 0 0-4.068 0l-26 23.984a3 3 0 0 0 4.068 4.41l2.265-2.09 6.809 24.683A3 3 0 0 0 20 63h24a3 3 0 0 0 2.892-2.202l6.809-24.683 2.265 2.09a2.988 2.988 0 0 0 2.033.795 3 3 0 0 0 2.035-5.205zM32 53a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-11a6.999 6.999 0 1 1 0-13.998A7 7 0 1 1 32 42z"
            fill={activeTab === 'timeline' ? '#1da1f2' : '#657786'} />
        </Svg>
        <Text style={{color: activeTab === 'timeline' ? '#1da1f2' : '#657786'}}>Timelines</Text>
      </View>
    </TouchableHighlight>
    <TouchableHighlight
      underlayColor="white"
      style={styles.tab}
      onPress={onNotifications}>
      <View>
        <Svg
          style={styles.notificationsIcon}
          viewBox="0 0 64 72">
          <Path
            d="M47.594 21.745a16.722 16.722 0 0 0-5.355-6.509l.053-.154c.863-2.373-.447-5.026-2.924-5.928-2.479-.902-5.188.288-6.051 2.661l-.057.152a16.726 16.726 0 0 0-1.163-.052c-7.805 0-14.575 5.361-17.667 13.99-3.212 8.963-9.247 13.91-9.3 13.953a2.999 2.999 0 0 0-.249 4.469c.31.31.684.548 1.095.698l35.917 13.072c.329.119.676.181 1.026.181h.024a3 3 0 0 0 2.878-3.849c-.22-1.423-1.07-8.41 1.888-16.412 2.124-5.748 2.083-11.528-.115-16.272zM26.355 64.206c3.399 1.235 7.099-.08 9.021-2.961l-14.028-5.107c-.381 3.444 1.607 6.83 5.007 8.068z"
            fill={activeTab === 'notifications' ? '#1da1f2' : '#657786'} />
        </Svg>
        <Text style={{color: activeTab === 'notifications' ? '#1da1f2' : '#657786'}}>Notifications</Text>
      </View>
    </TouchableHighlight>
  </View>
);

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    height: 65,
    borderTopWidth: 2,
    paddingTop: 5,
    borderColor: '#ccd6dd',
    backgroundColor: 'white',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  timelineIcon: {
    marginLeft: 15,
    height: 35,
    width: 35,
  },
  notificationsIcon: {
    marginLeft: 25,
    height: 35,
    width: 35,
  },
});
