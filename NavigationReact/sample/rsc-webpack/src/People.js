import * as React from 'react';
import { SceneView } from 'navigation-react';
import Filter from './Filter.js';
import List from './List.js';
import { doSomething } from './action.js';

const People = async () => {
  return (
    <>
      <h1>People</h1>
      <Filter doSomething={doSomething} />
      <SceneView active="people" name="list">
        <List />
      </SceneView>
    </>
  );
}

export default People;
