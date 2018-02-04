import React from 'react';
import { NavigationBackLink } from 'navigation-react';

export default ({ person }) => (
    <div>
        <NavigationBackLink distance={1}>
            Person Search
        </NavigationBackLink>
        <div>
            <h2>{person.name}</h2>
            <div className="label">Date of Birth</div>
            <div>{person.dateOfBirth}</div>
            <div className="label">Email</div>
            <div>{person.email}</div>
            <div className="label">Phone</div>
            <div>{person.phone}</div>
        </div>
    </div>
);
