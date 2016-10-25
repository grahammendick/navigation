import React from 'react';
import ReactDOM from 'react-dom';
import { getStateNavigator, registerComponents } from './NavigationShared';

/**
 * Creates a State Navigator and, after registering the controllers, triggers
 * an initial render for the current State and props returned from the server. 
 */
var stateNavigator = getStateNavigator();
registerControllers(stateNavigator);
registerComponents(stateNavigator);
stateNavigator.start();

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
    stateNavigator.onNavigate(function(oldState, state, data, asyncData) {
        asyncData.stateNavigator = stateNavigator;
        ReactDOM.render(
            stateNavigator.stateContext.state.createComponent(asyncData),
            document.getElementById('content')
        );
    });
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
