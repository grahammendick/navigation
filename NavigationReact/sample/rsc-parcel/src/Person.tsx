'use server-entry'
import { SceneView, NavigationBackLink } from 'navigation-react';
import Details from './Details';
import Gender from './Gender';
import Friends from './Friends';

const Person = () => {
  return (
    <>
      <div>
        <NavigationBackLink distance={1}>Person Search</NavigationBackLink>
        <Details />
        <Gender>
          <SceneView active="person" name="friends" fallback={<div />}>
            <Friends />
          </SceneView>
        </Gender>
      </div>
    </>
  )
}

export default Person;
