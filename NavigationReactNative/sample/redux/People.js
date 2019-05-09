import React from 'react';
import {ScrollView, FlatList} from 'react-native';
import PersonItem from './PersonItem';

export default ({ids}) => (
  <ScrollView contentInsetAdjustmentBehavior="automatic">
    <FlatList
      data={ids}
      keyExtractor={({id}) => id}
      renderItem={({id}) => <PersonItem id={id} />} />
  </ScrollView>
);
