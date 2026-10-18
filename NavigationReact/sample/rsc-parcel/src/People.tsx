'use server-entry'
import { SceneView } from 'navigation-react';
import Filter from './Filter';
import List from './List';
import ListFallback from './ListFallback';

const People = async () => {
  return (
    <>
      <Filter />
      <SceneView active="people" name="list" errorFallback={<ListFallback />}>
        <List />
      </SceneView>
    </>
  );
}

export default People;
