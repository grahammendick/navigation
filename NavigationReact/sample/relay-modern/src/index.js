import React from 'react';
import ReactDOM from 'react-dom';
import { QueryRenderer } from 'react-relay';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import { PeopleQuery, PeopleContainer } from './People.js';
import { PersonQuery, PersonContainer } from './Person.js';
import { StateNavigator } from 'navigation';
import { NavigationContext, NavigationHandler } from 'navigation-react';

var stateNavigator = new StateNavigator([
    {
        key: "people",
        route: "{pageNumber?}",
        defaults: { pageNumber: 1 },
        component: PeopleContainer,
        query: PeopleQuery
    },
    {
        key: "person",
        route: "person/{id}",
        defaults: { id: 0 },
        trackCrumbTrail: true,
        component: PersonContainer,
        query: PersonQuery
    }
]);

function fetchQuery(operation, variables) {
    return fetch("/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: operation.text,
            variables
        })
    }).then(response => {
        return response.json();
    });
}

const modernEnvironment = new Environment({
    network: Network.create(fetchQuery),
    store: new Store(new RecordSource())
});

stateNavigator.start();

ReactDOM.render(
    <NavigationHandler stateNavigator={stateNavigator}>
        <NavigationContext.Consumer>
            {({ state, data }) => (
                <QueryRenderer
                    environment={modernEnvironment}
                    query={state.query}
                    variables={data}
                    render={({ error, props }) => (
                        props ? <state.component {...props} /> : <div>Loading</div>
                    )}
                />                
            )}
        </NavigationContext.Consumer>        
    </NavigationHandler>,
    document.getElementById('content')
);
