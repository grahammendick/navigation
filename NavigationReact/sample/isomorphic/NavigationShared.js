import React from 'react';
import Navigation from 'navigation';
import People from './People';
import Person from './Person';

/**
 * Configures the states for the two views.
 */
function getStateNavigator() {
    return new Navigation.StateNavigator([
        {key: 'people', route: '{pageNumber?}', defaults: {pageNumber: 1}},
        {key: 'person', route: 'person/{id}', defaults: {id: 0}, trackCrumbTrail: true}
    ], new Navigation.HTML5HistoryManager());
}

/**
 * Registers the components creators for the States.
 */
function registerComponents(stateNavigator) {
    stateNavigator.states.people.createComponent = function(data) {
        return React.createElement(People.Listing, data);
    }
    stateNavigator.states.person.createComponent = function(data, url, navigate) {
        return React.createElement(Person.Details, data);
    }
}

export { getStateNavigator, registerComponents }