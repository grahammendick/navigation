'use server-entry'
import { SceneView } from 'navigation-react';
import Filter from './Filter';
import List from './List';
import { Suspense } from 'react';

const People = async () => {
  return (
    <>
      <title>People</title>
      <h1>People</h1>
      <Filter />
      <Suspense fallback={<h2>Loading</h2>}>
        <SceneView active="people" name="list">
          <List />
        </SceneView>
      </Suspense>
    </>
  );
}

export default People;
