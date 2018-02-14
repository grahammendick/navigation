import React from 'react';
import { StateNavigator } from 'navigation';
import { MobileHistoryManager } from 'navigation-react-mobile';
import People from './People';
import Person from './Person';
import { searchPeople, getPerson } from './Data';

function getStateNavigator() {
    var stateNavigator = new StateNavigator([
        {key: 'people', route: '{pageNumber?}', defaults: {pageNumber: 1}},
        {key: 'person', route: 'person/{id}', defaults: {id: 0}, trackCrumbTrail: true}
    ], new MobileHistoryManager(url => {
        var { state, data } = stateNavigator.parseLink(url);
        return stateNavigator.fluent()
            .navigate('people')
            .navigate(state.key, data).url;
    }, ''));

    var { people, person } = stateNavigator.states;
    people.renderScene = ({pageNumber}) => <People people={searchPeople(pageNumber)} />;
    person.renderScene = ({id}) => <Person person={getPerson(id)} />;
    return stateNavigator;
}

export default getStateNavigator;
