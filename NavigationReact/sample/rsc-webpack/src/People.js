import * as React from 'react';
import { SceneView } from 'navigation-react';
import Filter from './Filter.js';
import List from './List.js';

const People = async () => {
  return (
    <>
      <Filter />
      <SceneView active="people" name="list">
        <List />
      </SceneView>
    </>
  );
}

export default People;
