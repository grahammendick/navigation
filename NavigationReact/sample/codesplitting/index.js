/**
 * Adds React and Data modules to prevent them from appearing in the People
 * and Person component webpack bundles
 */
import Data from './Data';
import { StateNavigator } from 'navigation';
import { NavigationContext, NavigationHandler } from 'navigation-react';
import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Configures the states for the two views.
 */
var stateNavigator = new StateNavigator([
    {key: 'people', route: '{pageNumber?}', defaults: {pageNumber: 1 }},
    {key: 'person', route: 'person/{id}', defaults: {id: 0 }, trackCrumbTrail: true}
]);

/**
 * Attaches the navigating hooks to the two States. Fired just before the State
 * becomes active, it uses webpack's code splitting to load the respective
 * component on demand. When the component returns it registers the views
 * and then continues with the navigation.
 */
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
