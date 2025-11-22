import { NavigationLink, RefreshLink, useNavigationEvent } from 'navigation-react';
import { searchPeople } from './data';
import Pager from './Pager';
import Test from './Test';

const List = async () => {
  const {data: {name, page, size, sort}} = useNavigationEvent();
  const {people, count} = await searchPeople(name, page, size, sort);
  return (
    <>
    <Test />
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
      <Pager totalRowCount={count} />
    </>
  )
}

export default List;
