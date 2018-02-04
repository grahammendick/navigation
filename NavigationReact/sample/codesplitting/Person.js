import { getPerson } from './Data';
import React from 'react';
import ReactDOM from 'react-dom';
import { NavigationBackLink } from 'navigation-react';

/**
 * Registers the view for the Details State.
 */
function registerView(stateNavigator) {
    stateNavigator.states.person.renderView = ({id}) => (
        <Details person={getPerson(id)} />
    );
}

var Details = ({ person }) => (
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

export { registerView };
