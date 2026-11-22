'use server';
import { Text, View } from 'react-native';
import { SceneView } from 'navigation-react';
import Filter from './Filter';
import List from './List';
import Link from './Link';

const People = async () => {
  return (
    <View>
      <Filter />
      <SceneView active="people" name="list">
        <List />
      </SceneView>
      <Link stateKey="tabs"><Text style={{fontSize: 24}}>Tabs</Text></Link>
    </View>
  );
};

export default People;
