import { searchPeople } from './data';
import { NavigationLink, RefreshLink, useNavigationEvent } from 'navigation-react';

const People = async () => {
  const { data: { page, sort } } = useNavigationEvent();
  const people: any = await searchPeople(page, sort);
  return (
    <>
      <h1>People</h1>
      <table>
        <thead>
          <tr>
            <th>
              <RefreshLink
                navigationData={{ sort: sort === 'asc' ? 'desc' : 'asc' }}
                includeCurrentData>
                Name
              </RefreshLink></th>
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
          navigationData={{ page: 1 }}
          disableActive>
          1
        </RefreshLink>
        <RefreshLink
          navigationData={{ page: 2 }}
          disableActive>
          2
        </RefreshLink>
      </div>
    </>
  );
}

export default People;
