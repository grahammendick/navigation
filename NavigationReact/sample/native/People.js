import React from 'react';
import { ListView, StyleSheet, Text, View, TouchableHighlight } from 'react-native';

export default ({ people, stateNavigator }) => {
  const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  const dataSource = ds.cloneWithRows(people);
  const renderRow = (rowData) => (
    <TouchableHighlight onPress={() => {
        stateNavigator.navigate('person', {id: rowData.id});
      }}>
      <Text style={styles.text}>
        {rowData.name}
      </Text>
    </TouchableHighlight>
  );
  return (
    <ListView
      dataSource={dataSource}
      renderRow={renderRow}
      renderSeparator={(sectionId, rowId) => (
        <View key={rowId} style={styles.separator} />
      )}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    flex: 1,
    justifyContent: 'center',
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  separator: {
    flex: 1,
    height: 2,
    backgroundColor: '#8E8E8E',
  },
});

