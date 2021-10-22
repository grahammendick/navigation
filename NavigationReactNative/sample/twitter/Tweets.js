import React from 'react';
import {StyleSheet, FlatList} from 'react-native';
import TweetItem from './TweetItem';

export default ({renderHeader, tweets, onTimeline}) => (
  <FlatList
    data={tweets}
    keyExtractor={item => '' + item.id}
    contentInsetAdjustmentBehavior="automatic"
    nestedScrollEnabled={true}
    ListHeaderComponent={renderHeader && renderHeader()}
    style={styles.view}
    renderItem={({item}) => (
      <TweetItem {...item} onTimeline={onTimeline} />
    )} />
);

const styles = StyleSheet.create({
  view: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});
