import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import People from './People.js';
import Person from './Person.js';
import { StateNavigator } from 'Navigation';

/**
 * Configures the states for the two views. Adds the Relay Route and Component
 * to each state so that a generic function can render the Relay RootContainer.
 */
var stateNavigator = new StateNavigator([
    { key: 'people', route: '{pageNumber?}', defaults: { pageNumber: 1 },
        component: People, relayRoute: (data) => new PeopleRoute(data) },
    { key: 'person', route: 'person/{id}', defaults: { id: 0 }, trackCrumbTrail: true,
        component: Person, relayRoute: (data) => new PersonRoute(data) }
]);

/**
 * The Relay Route for the people state.
 */
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

/**
 * The Relay Route for the person state.
 */
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

/**
 * Listens for navigation events and renders the Relay RootContainer, passing
 * in the Relay Route and Component retrieved from the state.
 */
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

