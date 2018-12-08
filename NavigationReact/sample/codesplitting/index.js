import { searchPeople, getPerson } from './Data';
import { StateNavigator } from 'navigation';
import { NavigationContext, NavigationHandler } from 'navigation-react';
import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';

var stateNavigator = new StateNavigator([
    {key: 'people', route: '{pageNumber?}', defaults: {pageNumber: 1 }},
    {key: 'person', route: 'person/{id}', defaults: {id: 0 }, trackCrumbTrail: true}
]);

stateNavigator.states.people.renderView = ({pageNumber}) => {
    var Listing = lazy(() => import('./People'));
    return <Listing people={searchPeople(pageNumber)} />
};

stateNavigator.states.person.renderView = ({id}) => {
    var Details = lazy(() => import('./Person'));
    return <Details person={getPerson(id)} />
};

stateNavigator.start();

ReactDOM.render(
    <NavigationHandler stateNavigator={stateNavigator}>
        <Suspense fallback={<div>Loading...</div>}>
            <NavigationContext.Consumer>
                {({ state, data }) => state.renderView(data)}
            </NavigationContext.Consumer>
        </Suspense>
    </NavigationHandler>,
    document.getElementById('content')
);
