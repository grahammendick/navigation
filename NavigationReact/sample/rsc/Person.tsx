'use server-entry'

import { getPerson } from './data';
import { SceneView, NavigationBackLink, useNavigationEvent, RefreshLink } from 'navigation-react';
import Friends from "./Friends";

const Person = async () => {
  const {data} = useNavigationEvent();
  const {name, dateOfBirth, email, phone} = await getPerson(data.id);
  return (
    <>
      <h1>Person</h1>
      <div>
        <NavigationBackLink distance={1}>Person Search</NavigationBackLink>
        <RefreshLink navigationData={{id: 1}} includeCurrentData>Test</RefreshLink>
        <div>
          <h2>{name}</h2>
          <div>Date of Birth</div>
          <div>{dateOfBirth}</div>
          <div>Email</div>
          <div>{email}</div>
          <div>Phone</div>
          <div>{phone}</div>
        </div>
      </div>
    </>
  )
}

export default Person;
