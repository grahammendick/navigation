import React from 'react';
import { NavigationLink, RefreshLink, NavigationBackLink } from 'navigation-react';

var Listing = ({ people, stateNavigator }) => {
    var rows = people.map((person) => (
        <tr key={person.id}>
            <td>
                <NavigationLink
                    stateKey="person"
                    navigationData={{ id: person.id }}
                    stateNavigator={stateNavigator}>
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
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    1
                </RefreshLink>
                <RefreshLink
                    navigationData={{ pageNumber: 2 }}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    2
                </RefreshLink>                    
            </div>
        </div>
    );
};

var Details = ({ person, store, stateNavigator }) => {
    var handleChange = (event) => {
        store.dispatch({
            type: 'EDIT',
            id: person.id,
            name: event.target.value
        });
    };
    return (
        <div>
            <NavigationBackLink
                distance={1}
                stateNavigator={stateNavigator}>
                Person Search
            </NavigationBackLink>
            <div>
                <h2>{person.name}</h2>
                <label htmlFor="name">Date of Birth</label>
                <input id="name" value={person.name} onChange={handleChange} />
                <div className="label">Email</div>
                <div>{person.email}</div>
                <div className="label">Phone</div>
                <div>{person.phone}</div>
            </div>
        </div>
    );
};

export { Listing, Details };