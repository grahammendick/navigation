import React from 'react';
import { ListView, Text } from 'react-native';

export default ({ people }) => {
  const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  const dataSource = ds.cloneWithRows(people);
  return (
    <ListView
      dataSource={dataSource}
      renderRow={(rowData) => (
        <Text>{rowData.name + ' - ' + rowData.dateOfBirth}</Text>
      )}
    />
  );
};

