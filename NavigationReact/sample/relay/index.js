import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import People from './People.js';
import Person from './Person.js';
import { StateNavigator } from 'Navigation';

var stateNavigator = new StateNavigator([
    { key: 'people', route: '{pageNumber?}', defaults: { pageNumber: 1 },
        component: People, relayRoute: (data) => new PeopleRoute(data) },
    { key: 'person', route: 'person/{id}', defaults: { id: 0 }, trackCrumbTrail: true,
        component: Person, relayRoute: (data) => new PersonRoute(data) }
]);

class PeopleRoute extends Relay.Route {
    static routeName = 'People';
    static queries = {
        people: (Component) => Relay.QL`
            query PeopleQuery {
                people(pageNumber: $pageNumber) { ${Component.getFragment('people')} },
            }
        `,
    };
}

class PersonRoute extends Relay.Route {
    static routeName = 'Person';
    static queries = {
        person: (Component) => Relay.QL`
            query PersonQuery {
                person(id: $id) { ${Component.getFragment('person')} },
            }
        `,
    };
}

stateNavigator.onNavigate((oldState, state, data) => {
    var route = state.relayRoute(data);
    var Component = state.component;
    ReactDOM.render(
        <Relay.RootContainer
            renderFetched={data =>
                <Component {...data} stateNavigator={stateNavigator} />
            }
            Component={Component}
            route={route}
            />,
        document.getElementById('content')
    );
});

stateNavigator.start();

