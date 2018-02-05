import Data from './Data';
import { StateNavigator } from 'navigation';
import { NavigationContext, NavigationHandler } from 'navigation-react';
import React from 'react';
import ReactDOM from 'react-dom';

var stateNavigator = new StateNavigator([
    {key: 'people', route: '{pageNumber?}', defaults: {pageNumber: 1 }},
    {key: 'person', route: 'person/{id}', defaults: {id: 0 }, trackCrumbTrail: true}
]);

stateNavigator.states.people.navigating = function(data, url, navigate) {
    require.ensure(['./People'], function(require) {
        require('./People').registerView(stateNavigator);
        navigate();
    });
}
stateNavigator.states.person.navigating = function(data, url, navigate) {
    require.ensure(['./Person'], function(require) {
        require('./Person').registerView(stateNavigator);
        navigate();
    });
}

stateNavigator.start();

ReactDOM.render(
    <NavigationHandler stateNavigator={stateNavigator}>
        <NavigationContext.Consumer>
            {({ state, data }) => state && state.renderView(data)}
        </NavigationContext.Consumer>        
    </NavigationHandler>,
    document.getElementById('content')
);
