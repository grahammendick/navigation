import React from 'react';
import ReactDOM from 'react-dom';
import { NavigationContext, NavigationHandler } from 'navigation-react';
import getStateNavigator from './NavigationShared';

/**
 * Creates a State Navigator and, after registering the controllers, triggers
 * an initial render for the current State and props returned from the server. 
 */
var stateNavigator = getStateNavigator();
registerControllers(stateNavigator);
stateNavigator.start();

ReactDOM.hydrate(
    <NavigationHandler stateNavigator={stateNavigator}>
        <NavigationContext.Consumer>
            {({ state, asyncData }) => state.renderView(asyncData)}
        </NavigationContext.Consumer>        
    </NavigationHandler>,
    document.getElementById('content')
);

/**
 * Attaches the navigation hooks to the two States. The navigating hook, fired
 * just before the State becomes active, issues an AJAX request for the data -
 * the same Urls are used for HTML and AJAX requests. The onNavigation handler,
 * fired when the State is active, renders the data returned.
 */
function registerControllers(stateNavigator) {
    stateNavigator.states.people.navigating = 
    stateNavigator.states.person.navigating = function(data, url, navigate) {
        fetchData(url, navigate);
    }
}

function fetchData(url, navigate) {
    if (serverProps) {
        navigate(serverProps);
        serverProps = null;
        return;
    }
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState === 4){
            navigate(JSON.parse(req.responseText));
        }
    };
    req.open('get', url);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(null);
}
