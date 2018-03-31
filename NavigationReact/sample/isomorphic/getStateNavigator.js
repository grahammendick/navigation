import React from 'react';
import { StateNavigator, HTML5HistoryManager } from 'navigation';
import People from './People';
import Person from './Person';

function getStateNavigator() {
    var stateNavigator = new StateNavigator([
        {key: 'people', route: '{pageNumber?}', defaults: {pageNumber: 1}},
        {key: 'person', route: 'person/{id}', defaults: {id: 0}, trackCrumbTrail: true}
    ], new HTML5HistoryManager());

    var { people, person } = stateNavigator.states;
    people.renderView = data => <People {...data} />;
    person.renderView = data => <Person {...data} />;
    return stateNavigator;
}

export default getStateNavigator;
