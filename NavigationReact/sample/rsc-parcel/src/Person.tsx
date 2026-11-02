'use server-entry'
import { SceneView, NavigationBackLink, NavigationLink, useNavigationEvent } from 'navigation-react';
import { getPerson } from './data';
import Gender from './Gender';
import Friends from './Friends';
import Edit from './Edit';

const Person = async () => {
  const {data: {id}} = useNavigationEvent();
  const {name, dateOfBirth, email, phone} = await getPerson(id);
  return (
    <>
      <div>
        <NavigationBackLink distance={1}>Person Search</NavigationBackLink>
        <NavigationLink id="self" stateKey="person" navigationData={{id}}>Self</NavigationLink>
        <div>
          <Edit id={id} name={name} />
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
