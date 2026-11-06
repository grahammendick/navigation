'use server-entry'
import { SceneView } from 'navigation-react';
import Filter from './Filter';
import List from './List';

const People = async () => {
  return (
    <>
      <Filter />
      <SceneView active="people" name="list" cache={false} fallback={<h2>loading...</h2>}>
        <List />
      </SceneView>
    </>
  );
}

export default People;
