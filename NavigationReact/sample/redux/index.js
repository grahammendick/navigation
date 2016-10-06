import { Listing, Detail } from './Component';
import { StateNavigator } from 'navigation';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';

var stateNavigator = new StateNavigator([
    {key: 'people', route: '{pageNumber?}', defaults: {pageNumber: 1 }},
    {key: 'person', route: 'person/{id}', defaults: {id: 0 }}
]);

var store = createStore();

store.subscribe(() => {
    var { stateContext: { state, data} } = stateNavigator;
    state.render(data, store);
})

stateNavigator.onNavigate((oldState, state, data) => {
    state.render(data, store);
});

stateNavigator.states.people.render = function(data, store) {
    var people = store.getState();
	var start = (data.pageNumber - 1) * 10;
	people = people.slice(start, start + 10);
    ReactDOM.render(
        <Listing
            people={people}
            store={store}
            stateNavigator={stateNavigator} />,
        document.getElementById('content')
    );		
}

stateNavigator.states.person.navigated = function(data, state) {
    var people = store.getState();
    var person = people.filter((person) => person.id === data.id)[0];
    ReactDOM.render(
        <Details
            person={person}
            store={store}
            stateNavigator={stateNavigator} />,
        document.getElementById('content')
    );		
}
