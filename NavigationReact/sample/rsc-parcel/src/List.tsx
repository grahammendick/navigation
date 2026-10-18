import { NavigationLink, RefreshLink, useNavigationEvent } from 'navigation-react';
import { searchPeople } from './data';
import Pager from './Pager';

const List = async () => {
  const {data} = useNavigationEvent();
  if (data.page === 2 && !data.allowed) throw Error();
  const {name, page, size, sort} = data;
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
      <Pager totalRowCount={count} />
    </>
  )
}

export default List;
