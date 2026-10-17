'use server-entry'
import { SceneView, NavigationLink } from 'navigation-react';
import Filter from './Filter';
import List from './List';

const People = async () => {
  return (
    <>
      <Filter />
      <NavigationLink stateKey="person" navigationData={{id: 99}}>Missing Person</NavigationLink>
      <SceneView active="people" name="list">
        <List />
      </SceneView>
    </>
  );
}

export default People;
