import * as React from 'react';
import { SceneView, NavigationBackLink, useNavigationEvent } from 'navigation-react';
import { getPerson } from './data.js';
import Gender from './Gender.js';
import Friends from './Friends.js';
import Edit from './Edit.js';
import updateName from "./updateName.js";

const Person = async () => {
  const {data: {id}} = useNavigationEvent();
  const {name, dateOfBirth, email, phone} = await getPerson(id);
  return (
    <>
      <div>
        <NavigationBackLink distance={1}>Person Search</NavigationBackLink>
        <div>
          <Edit id={id} name={name} updateName={updateName} />
          <div>Date of Birth</div>
          <div>{dateOfBirth}</div>
          <div>Email</div>
          <div>{email}</div>
          <div>Phone</div>
          <div>{phone}</div>
        </div>
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
