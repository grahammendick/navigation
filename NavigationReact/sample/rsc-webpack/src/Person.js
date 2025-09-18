import * as React from 'react';
import { SceneView, NavigationBackLink, RefreshLink, useNavigationEvent } from 'navigation-react';
import { getPerson } from './data.js';
import Gender from './Gender.js';
import Friends from './Friends.js';

const Person = async () => {
  const {data: {id, show}} = useNavigationEvent();
  const {name, dateOfBirth, email, phone} = await getPerson(id);
  return (
    <>
      <h1>Person</h1>
      <div>
        <NavigationBackLink distance={1}>Person Search</NavigationBackLink>
        <div>
          <h2>{name}</h2>
          <div>Date of Birth</div>
          <div>{dateOfBirth}</div>
          <div>Email</div>
          <div>{email}</div>
          <div>Phone</div>
          <div>{phone}</div>
        </div>
        <RefreshLink navigationData={{show: !show}} includeCurrentData>{`${!show ? 'Show' : 'Hide'} Friends`}</RefreshLink>
        <Gender />
        <SceneView active="person" name="friends">
          <Friends />
        </SceneView>
      </div>
    </>
  )
}

export default Person;
