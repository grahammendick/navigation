import { searchPeople } from './Data';
import React from 'react';
import ReactDOM from 'react-dom';
import { NavigationLink, RefreshLink } from 'navigation-react';

/**
 * Registers the component creator for the Listing State.
 */
exports.registerComponent = function(stateNavigator) {
    stateNavigator.states.people.createComponent = function(data) {
        var people = searchPeople(data.pageNumber);
        return React.createElement(Listing, {people: people, stateNavigator: stateNavigator});
    }
}

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
