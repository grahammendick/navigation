import React from 'react';
import { NavigationLink, RefreshLink, NavigationBackLink } from 'navigation-react';

var People = ({ people }) => {
    var rows = people.map((person) => (
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

var Person = ({ person }) => (
    <div>
        <NavigationBackLink distance={1}>
            People
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

export { People, Person };
