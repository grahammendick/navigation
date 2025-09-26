'use server-entry'
import { SceneView } from 'navigation-react';
import Filter from './Filter';
import List from './List';

const People = async () => {
  return (
    <>
      <h1>People</h1>
      <Filter />
      <SceneView active="people" name="list">
        <List />
      </SceneView>
    </>
  );
}

export default People;
