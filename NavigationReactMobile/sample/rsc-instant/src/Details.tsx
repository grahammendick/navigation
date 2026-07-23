'use server-entry'
import { SceneView, useNavigationEvent } from 'navigation-react';
import { getPerson } from './data';
import Gender from './Gender';
import Friends from './Friends';
import Name from './Name';

const Details = async () => {
  const {data: {id}} = useNavigationEvent();
  const {name, dateOfBirth, email, phone} = await getPerson(id);
  return (
    <>
      <title>{name}</title>
      <div>
        <Name id={id} name={name} />
        <div>Date of Birth</div>
        <div>{dateOfBirth}</div>
        <div>Email</div>
        <div>{email}</div>
        <div>Phone</div>
        <div>{phone}</div>
      </div>
      <Gender>
        <SceneView active="person" name="friends">
          <Friends />
        </SceneView>
      </Gender>
    </>
  )
}

export default Details;
