import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { NavigationLink, RefreshLink} from 'navigation-react';

var People = ({ people }) => {
    var rows = people.persons.map((person) => (
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
    ));
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Date of Birth</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
            <div>
                Go to page
                <RefreshLink
                    navigationData={{ pageNumber: 1 }}
                    disableActive={true}>
                    1
                </RefreshLink>
                <RefreshLink
                    navigationData={{ pageNumber: 2 }}
                    disableActive={true}>
                    2
                </RefreshLink>                    
            </div>
        </div>
    );
};

var PeopleQuery = graphql`
    query PeopleQuery($pageNumber: Int) {
        people(pageNumber: $pageNumber) {
            ...People_people
        }
    }
`;

var PeopleContainer = createFragmentContainer(People, {
    people: graphql`
        fragment People_people on People {
            persons {
                id,
                name,
                dateOfBirth
            }
        }
    `,
});

export { PeopleQuery, PeopleContainer };
