import React from 'react';
import { NavigationBackLink } from 'navigation-react';

export default ({ person, stateNavigator }) => (
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

