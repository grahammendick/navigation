'use server-entry'
import { SceneView, NavigationBackLink, useNavigationEvent } from 'navigation-react';
import { getPerson, getAddress } from './data';
import Gender from './Gender';
import Friends from './Friends';
import Edit from './Edit';
import Address from './Address';

const Person = async () => {
  const {data: {id}} = useNavigationEvent();
  const {name, dateOfBirth, email, phone} = await getPerson(id);
  return (
    <>
      <div>
        <NavigationBackLink distance={1}>Person Search</NavigationBackLink>
        <div>
          <Edit id={id} name={name} />
          <div>Date of Birth</div>
          <div>{dateOfBirth}</div>
          <div>Email</div>
          <div>{email}</div>
          <div>Phone</div>
          <div>{phone}</div>
          <Address address={getAddress(id)} />
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
