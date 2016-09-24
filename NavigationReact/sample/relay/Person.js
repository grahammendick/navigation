import React from 'react';
import Relay from 'react-relay';
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

export default Relay.createContainer(Person, {
    fragments: {
        person: () => Relay.QL`
            fragment on Person {
                name,
                dateOfBirth,
                email,
                phone
            }
        `,
    },
});
