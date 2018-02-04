import People from './People';
import Person from './Person';
import { searchPeople, getPerson } from './Data';
import Navigation from 'navigation';
import React from 'react';
import ReactDOM from 'react-dom';

function configure(stateNavigator) {
    stateNavigator.configure([
        {key: 'people', route: '{pageNumber?}', defaults: {pageNumber: 1 }},
        {key: 'person', route: 'person/{id}', defaults: {id: 0}, trackCrumbTrail: true}
    ]);
    
    stateNavigator.states.people.renderView = ({pageNumber}) => (
        <People people={searchPeople(pageNumber)} />
    );

    stateNavigator.states.person.renderView = ({id}) => (
        <Person person={getPerson(id)} />
    );
}

export { configure };

