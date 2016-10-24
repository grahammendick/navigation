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
    
    stateNavigator.states.people.navigated = function(data) {
        var people = searchPeople(data.pageNumber);
        ReactDOM.render(
            React.createElement(People, {people: people, stateNavigator: stateNavigator}),
            document.getElementById('content')
        );		
    }

    stateNavigator.states.person.navigated = function(data) {
        var person = getPerson(data.id);
        ReactDOM.render(
            React.createElement(Person, {person: person, stateNavigator: stateNavigator}),
            document.getElementById('content')
        );		
    }
    return stateNavigator;
}

export { configure };

