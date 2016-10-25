import { Listing, Details } from './Component';
import { StateNavigator } from 'navigation';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import reducer from './reducer';

/**
 * Configures the states for the two views.
 */
var stateNavigator = new StateNavigator([
    {key: 'people', route: '{pageNumber?}', defaults: {pageNumber: 1 }},
    {key: 'person', route: 'person/{id}', defaults: {id: 0 }, trackCrumbTrail: true}
]);

var store = createStore(reducer);

/**
 * Subscribes to store changes. Calls render on the current state, passing the
 * current data and store
 */
store.subscribe(() => {
    var { stateContext: { state, data} } = stateNavigator;
    state.render(data, store);
})

/**
 * Subscribes to navigation events. Calls render on the new state, passing the
 * new data and store.
 */
stateNavigator.onNavigate((oldState, state, data) => {
    state.render(data, store);
});

/**
 * Filters the people in the store by the page number in the navigation data.
 * Renders the Listing Component with the filtered data.
 */
stateNavigator.states.people.render = function(data, store) {
    var people = store.getState();
    var start = (data.pageNumber - 1) * 10;
    people = people.slice(start, start + 10);
    ReactDOM.render(
        <Listing
            people={people}
            stateNavigator={stateNavigator} />,
        document.getElementById('content')
    );
};

/**
 * Finds the person from the people in the store and id in the navigation data.
 * Renders the Details Component with the person.
 */
stateNavigator.states.person.render = function(data, store) {
    var people = store.getState();
    var person = people.filter((person) => person.id === data.id)[0];
    var handleChange = (name) => {
        store.dispatch({
            type: 'EDIT',
            id: person.id,
            name: name
        });
    };
    ReactDOM.render(
        <Details
            person={person}
            handleChange={handleChange}
            stateNavigator={stateNavigator} />,
        document.getElementById('content')
    );
};

stateNavigator.start();
