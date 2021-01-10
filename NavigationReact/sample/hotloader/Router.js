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

    const {people, person} = stateNavigator.states;
    people.renderScene = ({pageNumber}) => <People people={searchPeople(pageNumber)} />;
    person.renderScene = ({id}) => <Person person={getPerson(id)} />;
}

export { configure };

