import { getPerson } from './data';
import { NavigationBackLink, useNavigationEvent } from 'navigation-react';

const Person = async () => {
  const { data } = useNavigationEvent();
  const person: any = await getPerson(data.id);
  return (
    <>
      <h1>Person</h1>
      <div>
        <NavigationBackLink distance={1}>
          Person Search
        </NavigationBackLink>
        <div>
          <h2>{person.name}</h2>
          <div>Date of Birth</div>
          <div>{person.dateOfBirth}</div>
          <div>Email</div>
          <div>{person.email}</div>
          <div>Phone</div>
          <div>{person.phone}</div>
        </div>
      </div>
    </>
  )
}

export default Person;
