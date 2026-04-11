'use server-entry'
import { SceneView, NavigationBackLink, useNavigationEvent } from 'navigation-react';
import { getPerson } from './data';
import Gender from './Gender';
import Friends from './Friends';
import Name from './Name';
import { Suspense } from 'react';

const Person = async () => {
  const {data: {id}} = useNavigationEvent();
  const {name, dateOfBirth, email, phone} = await getPerson(id);
  return (
    <>
      <title>{name}</title>
      <h1>Person</h1>
      <div>
        <NavigationBackLink distance={1}>Person Search</NavigationBackLink>
        <div>
          <Name id={id} name={name} />
          <div>Date of Birth</div>
          <div>{dateOfBirth}</div>
          <div>Email</div>
          <div>{email}</div>
          <div>Phone</div>
          <div>{phone}</div>
        </div>
        <Gender />
        <Suspense fallback={<h2>loading</h2>}>
          <SceneView active="person" name="friends">
            <Friends />
          </SceneView>
        </Suspense>
      </div>
    </>
  )
}

export default Person;
