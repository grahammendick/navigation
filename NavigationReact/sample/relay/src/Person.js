import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { NavigationBackLink } from 'navigation-react';

var Person = ({ person }) => (
    <div>
        <NavigationBackLink distance={1}>
            Person Search
        </NavigationBackLink>
        <div>
            <h2>{person.name}</h2>
            <div className="label">Date of Birth</div>
            <div>{person.name}</div>
            <div className="label">Email</div>
            <div>{person.email}</div>
            <div className="label">Phone</div>
            <div>{person.phone}</div>
        </div>
    </div>
);

var PersonQuery = graphql`
    query PersonQuery($id: Int!) {
        person(id: $id) {
            ...Person_person
        }
    }
`;

var PersonContainer = createFragmentContainer(Person, {
    person: graphql`
        fragment Person_person on Person {
            name,
            dateOfBirth,
            email,
            phone
        }
    `,
});

export { PersonQuery, PersonContainer };
