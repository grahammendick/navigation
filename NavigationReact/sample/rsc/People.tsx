import { searchPeople } from './data';
import { NavigationLink, useNavigationEvent } from 'navigation-react';

const People = async () => {
  const {data} = useNavigationEvent();
  const people: any = await searchPeople(data.page);
  return (
    <>
      <h1>People</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date of Birth</th>
          </tr>
        </thead>
        <tbody>
          {people.map((person: any) => (
            <tr key={person.id}>
              <td>
                <NavigationLink
                  stateKey="person"
                  navigationData={{ id: person.id }}>
                  {person.name}
                </NavigationLink>
              </td>
              <td>{person.dateOfBirth}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default People;
