'use server';
import { View } from 'react-native';
import { SceneView } from 'navigation-react';
import Filter from './Filter';
import List from './List';
import Prefetch from './Prefetch';

const People = async () => {
  return (
    <View>
      <Prefetch />
      <Filter />
      <SceneView active="people" name="list">
        <List />
      </SceneView>
    </View>
  );
};

export default People;
