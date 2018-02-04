import NavigationReact from 'navigation-react';
import React from 'react';
import ReactDOM from 'react-dom';
import { NavigationContext, NavigationHandler } from 'navigation-react';
import getStateNavigator from './NavigationShared';

/**
 * Creates a State Navigator and, after registering the controllers, triggers
 * an initial render for the current State and props returned from the server. 
 */
var stateNavigator = getStateNavigator();

var hydrate = () => {
    stateNavigator.offNavigate(hydrate);
    ReactDOM.hydrate(
        <NavigationHandler stateNavigator={stateNavigator}>
            <NavigationContext.Consumer>
                {({ state, asyncData }) => state && state.renderView(asyncData)}
            </NavigationContext.Consumer>        
        </NavigationHandler>,
        document.getElementById('content')
    );
}

registerControllers(stateNavigator);
stateNavigator.onNavigate(hydrate);
stateNavigator.start();

/**
 * Attaches the navigation hooks to the two States. The navigating hook, fired
 * just before the State becomes active, uses webpack's code splitting to load
 * the respective component on demand and issues an AJAX request for the data -
 * the same Urls are used for HTML and AJAX requests. The navigated hook, fired
 * when the State is active, renders the data returned.
 */
function registerControllers(stateNavigator) {
    stateNavigator.states.people.navigating = function(data, url, navigate) {
        require.ensure(['./People'], function(require) {
            require('./People').registerView(stateNavigator);
            fetchData(url, navigate);
        });
    }
    stateNavigator.states.person.navigating = function(data, url, navigate) {
        require.ensure(['./Person'], function(require) {
            require('./Person').registerView(stateNavigator);
            fetchData(url, navigate);
        });
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
