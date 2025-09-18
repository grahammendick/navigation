import * as React from 'react';
import { SceneView } from 'navigation-react';
import Filter from './Filter.js';
import List from './List.js';

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
