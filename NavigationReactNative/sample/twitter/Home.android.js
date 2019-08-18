import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, BackHandler, Text, TouchableHighlight, ToolbarAndroid, View, ScrollView} from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import Tweets from './Tweets';
import Notifications from './Notifications';

export default ({tweets, follows}) => {
  const [page, setPage] = useState(0);
  const viewPager = useRef();
  const savedHandleBack = useRef();
  const handleBack = () => {
    if (page === 1) {
      setPage(0);
      viewPager.current.setPage(0);
    }
    return page === 1;
  }
  useEffect(() => {
    savedHandleBack.current = handleBack;
  });
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress',  () => (
      savedHandleBack.current()
    ));
    return () => {
      subscription.remove();
    }
  }, []);
  return (
    <View style={{flex: 1}}>
      <ToolbarAndroid title="Home" style={styles.toolbar} />
      <View style={styles.tabs}>
        <TouchableHighlight
          underlayColor="white"
          style={styles.tab}
          onPress={() => {
            setPage(0);
            viewPager.current.setPage(0);
          }}>
          <Text style={styles.text}>Home</Text>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor="white"
          style={styles.tab}
          onPress={() => {
            setPage(1);
            viewPager.current.setPage(1);
          }}>
          <Text style={styles.text}>Notifications</Text>
        </TouchableHighlight>
      </View>
      <ViewPager
        ref={viewPager}
        onPageSelected={({nativeEvent}) => {
          setPage(nativeEvent.position)
        }}
        style={{flex: 1}}>
        <View key={1}>
          <ScrollView style={styles.view}>
            <Tweets tweets={tweets} />
          </ScrollView>
        </View>
        <View key={2}>
          <ScrollView style={styles.view}>
            <Notifications follows={follows} />
          </ScrollView>
        </View>
      </ViewPager>
    </View>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    height: 50,
  },
  tabs: {
    height: 60,
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    alignItems: 'center'
  },
  text: {
    fontSize: 18,
  },
  view: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});
