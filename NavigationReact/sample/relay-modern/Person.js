import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { NavigationBackLink } from 'navigation-react';

var Person = ({ person, stateNavigator }) => (
    <div>
        <NavigationBackLink
            distance={1}
            stateNavigator={stateNavigator}>
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

export default createFragmentContainer(Person, {
    person: graphql`
        fragment Person_person on Person {
            name,
            dateOfBirth,
            email,
            phone
        }
    `,
});
