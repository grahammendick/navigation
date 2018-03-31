import React from 'react';
import { NavigationLink, RefreshLink } from 'navigation-react';
import { connect } from 'react-redux';

var mapStateToProps = (people, { pageNumber }) => {
    var start = (pageNumber - 1) * 10;
    return {
      people: people.slice(start, start + 10)
    }
};

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

export default connect(mapStateToProps)(People);
