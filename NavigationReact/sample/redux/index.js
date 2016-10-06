import { Listing, Detail } from './Component';
import { StateNavigator } from 'navigation';
import React from 'react';
import ReactDOM from 'react-dom';

var stateNavigator = new StateNavigator([
    {key: 'people', route: '{pageNumber?}', defaults: {pageNumber: 1 }},
    {key: 'person', route: 'person/{id}', defaults: {id: 0 }}
]);

stateNavigator.states.people.render = function(data, state) {
	var start = (data.pageNumber - 1) * 10;
	var people = state.slice(start, start + 10);
    ReactDOM.render(
        <Listing people={people} stateNavigator={stateNavigator} />,
        document.getElementById('content')
    );		
}

stateNavigator.states.person.navigated = function(data, state) {
    var person = state.filter((person) => person.id === data.id)[0];
    ReactDOM.render(
        <Details person={person} stateNavigator={stateNavigator} />,
        document.getElementById('content')
    );		
}
