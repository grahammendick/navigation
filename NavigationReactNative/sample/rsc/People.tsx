'use server';
import { View } from 'react-native';
import { SceneView } from 'navigation-react';
import Filter from './Filter';
import List from './List';
import { NavigationBar } from 'navigation-react-native';

const People = async () => {
  return (
    <View>
      <NavigationBar title="People" />
      <Filter />
      <SceneView active="people" name="list">
        <List />
      </SceneView>
    </View>
  );
};

export default People;
