import { NavigationLink, RefreshLink, useNavigationEvent } from 'navigation-react';
import { searchPeople } from './data';
import Pager from './Pager';
import Filter from './Filter';

const List = async () => {
  const {data: {name, page, size, sort}} = useNavigationEvent();
  const {people, count} = await searchPeople(name, page, size, sort);
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>
              <RefreshLink navigationData={{sort: sort === 'asc' ? 'desc' : 'asc'}} includeCurrentData>Name</RefreshLink>
            </th>
            <th>Date of Birth</th>
          </tr>
        </thead>
        <tbody>
          {people.map(({id, name, dateOfBirth}) => (
            <tr key={id}>
              <td>
                <NavigationLink stateKey="person" navigationData={{id: id}}>{name}</NavigationLink>
              </td>
              <td>{dateOfBirth}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Filter />
      <Pager totalRowCount={count} />
    </>
  )
}

export default List;
