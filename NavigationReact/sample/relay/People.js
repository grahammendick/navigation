import React from 'react';
import {
    NavigationLink,
    RefreshLink
} from 'navigation-react';

export default class Test extends React.Component {
    render() {
        console.log(this.props.people.persons[0].name);
        return <div>TEst</div>;
    }
}
/*export default ({ people, stateNavigator }) => {
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
};*/
