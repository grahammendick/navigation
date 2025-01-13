import { searchPeople } from './data';
import { NavigationLink, RefreshLink, useNavigationEvent } from 'navigation-react';

const People = async () => {
  const { data } = useNavigationEvent();
  const people: any = await searchPeople(data.pageNumber);
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
      <div>
        Go to page
        <RefreshLink
          navigationData={{ pageNumber: 1 }}
          disableActive>
          1
        </RefreshLink>
        <RefreshLink
          navigationData={{ pageNumber: 2 }}
          disableActive>
          2
        </RefreshLink>
      </div>
    </>
  );
}

export default People;
