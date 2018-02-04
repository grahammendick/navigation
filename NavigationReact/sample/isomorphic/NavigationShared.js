import React from 'react';
import { StateNavigator, HTML5HistoryManager } from 'navigation';
import People from './People';
import Person from './Person';

/**
 * Configures the states for the two views.
 */
function getStateNavigator() {
    return new StateNavigator([
        {key: 'people', route: '{pageNumber?}', defaults: {pageNumber: 1}},
        {key: 'person', route: 'person/{id}', defaults: {id: 0}, trackCrumbTrail: true}
    ], new HTML5HistoryManager());
}

/**
 * Registers the components creators for the States.
 */
function registerComponents(stateNavigator) {
    stateNavigator.states.people.renderView = function(data) {
        return <People {...data} />;
    }
    stateNavigator.states.person.renderView = function(data) {
        return <Person {...data} />;
    }
}

export { getStateNavigator, registerComponents }