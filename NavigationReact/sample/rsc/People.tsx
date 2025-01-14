'use server-entry'

import { searchPeople } from './data';
import { NavigationLink, RefreshLink, useNavigationEvent } from 'navigation-react';
import Filter from './Filter';

const People = async () => {
  const {data: {page, sort}} = useNavigationEvent();
  const people = await searchPeople(page, sort);
  return (
    <>
      <h1>People</h1>
      <Filter />
      <table>
        <thead>
          <tr>
            <th>
              <RefreshLink
                navigationData={{sort: sort === 'asc' ? 'desc' : 'asc'}}
                includeCurrentData>
                Name
              </RefreshLink></th>
            <th>Date of Birth</th>
          </tr>
        </thead>
        <tbody>
          {people.map(({id, name, dateOfBirth}) => (
            <tr key={id}>
              <td>
                <NavigationLink
                  stateKey="person"
                  navigationData={{id: id}}>
                  {name}
                </NavigationLink>
              </td>
              <td>{dateOfBirth}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        Go to page
        <RefreshLink
          navigationData={{page: 1}}
          includeCurrentData
          disableActive>
          1
        </RefreshLink>
        <RefreshLink
          navigationData={{page: 2}}
          includeCurrentData
          disableActive>
          2
        </RefreshLink>
      </div>
    </>
  );
}

export default People;
