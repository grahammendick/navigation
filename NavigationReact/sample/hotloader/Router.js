import { People, Person } from './Component';
import { searchPeople, getPerson } from './Data';
import Navigation from 'navigation';
import React from 'react';
import ReactDOM from 'react-dom';

function configure(stateNavigator) {
    stateNavigator.configure([
        {key: 'people', route: '{pageNumber?}', defaults: {pageNumber: 1 }},
        {key: 'person', route: 'person/{id}', defaults: {id: 0 }}
    ]);
    
    stateNavigator.states.people.renderView = ({pageNumber}) => (
        <People people={searchPeople(pageNumber)} />
    );

    stateNavigator.states.person.renderView = ({id}) => (
        <Person person={getPerson(id)} />
    );
    return stateNavigator;
}

export { configure };

