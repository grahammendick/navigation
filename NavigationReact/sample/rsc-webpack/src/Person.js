import * as React from 'react';
import { SceneView, NavigationBackLink, useNavigationEvent } from 'navigation-react';
import { getPerson } from './data.js';
import Gender from './Gender.js';
import Friends from './Friends.js';
import Name from './Name.js';
import updateName from "./updateName.js";

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
          <Name id={id} name={name} updateName={updateName} />
          <div>Date of Birth</div>
          <div>{dateOfBirth}</div>
          <div>Email</div>
          <div>{email}</div>
          <div>Phone</div>
          <div>{phone}</div>
        </div>
        <Gender />
        <SceneView active="person" name="friends">
          <Friends />
        </SceneView>
      </div>
    </>
  )
}

export default Person;
