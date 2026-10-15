import { SceneView } from 'navigation-react';
import Filter from './Filter';
import List from './List';

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
