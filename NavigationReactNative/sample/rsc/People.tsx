'use server';
import { ScrollView } from 'react-native';
import { SceneView } from 'navigation-react';
import { NavigationBar } from 'navigation-react-native';
import Filter from './Filter';
import List from './List';

const People = async () => {
  return (
    <>
      <NavigationBar title="People" />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Filter />
        <SceneView active="people" name="list">
          <List />
        </SceneView>
      </ScrollView>
    </>
  );
};

export default People;
