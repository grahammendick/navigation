import React from 'react';
import { ListView, Text, TouchableHighlight } from 'react-native';

export default ({ people, stateNavigator }) => {
  const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  const dataSource = ds.cloneWithRows(people);
  const renderRow = (rowData) => (
    <TouchableHighlight onPress={() => {
        stateNavigator.navigate('person', {id: rowData.id});
      }}>
      <Text>{rowData.name + ' - ' + rowData.dateOfBirth}</Text>
    </TouchableHighlight>
  );
  return (
    <ListView
      dataSource={dataSource}
      renderRow={renderRow}
    />
  );
};

