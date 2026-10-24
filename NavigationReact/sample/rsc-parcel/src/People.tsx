'use server-entry'
import { SceneView } from 'navigation-react';
import Filter from './Filter';
import List from './List';
import Toggle from './Toggle';
import Summary from './Summary';

const People = async () => {
  return (
    <>
      <Filter />
      <Toggle label="Summary">
        <SceneView active="people" name="summary">
          <Summary />
        </SceneView>
      </Toggle>
      <SceneView active="people" name="list">
        <List />
      </SceneView>
    </>
  );
}

export default People;
