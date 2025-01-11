import { searchPeople } from './data';
import { NavigationLink } from './Links';

const People = async () => {
  const people: any = await searchPeople(1);
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
