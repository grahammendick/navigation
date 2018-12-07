import { searchPeople, getPerson } from './Data';
import { StateNavigator } from 'navigation';
import { NavigationContext, NavigationHandler } from 'navigation-react';
import React from 'react';
import ReactDOM from 'react-dom';

var stateNavigator = new StateNavigator([
    {key: 'people', route: '{pageNumber?}', defaults: {pageNumber: 1 }},
    {key: 'person', route: 'person/{id}', defaults: {id: 0 }, trackCrumbTrail: true}
]);

stateNavigator.states.people.renderView = ({pageNumber}) => {
    var Listing = React.lazy(() => import('./People'));
    return <Listing people={searchPeople(pageNumber)} />
};

stateNavigator.states.person.renderView = ({id}) => {
    var Details = React.lazy(() => import('./Person'));
    return <Details person={getPerson(id)} />
};

stateNavigator.start();

ReactDOM.render(
    <NavigationHandler stateNavigator={stateNavigator}>
        <NavigationContext.Consumer>
            {({ state, data }) => state && state.renderView(data)}
        </NavigationContext.Consumer>        
    </NavigationHandler>,
    document.getElementById('content')
);
