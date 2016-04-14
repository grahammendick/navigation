var React = require('react');
var ReactDOM = require('react-dom');
var Navigation = require('navigation');
var NavigationShared = require('./NavigationShared');

/**
 * Creates and starts a State Navigator. Before registering the controllers
 * that handling navigation, does an initial render for the current State
 * using the props returned from the server. 
 */
var stateNavigator = NavigationShared.getStateNavigator();
registerControllers(stateNavigator);
stateNavigator.start();

/**
 * Renders the component for the current State and props into the content div.
 */
function render(stateNavigator, props) {
    var component = NavigationShared.createComponent(stateNavigator, props);
    ReactDOM.render(
        component,
        document.getElementById('content')
    );        
}

/**
 * Attaches the navigation hooks to the two States. The navigating hook, fired
 * just before the State becomes active, issues an AJAX request for the data -
 * the same Urls are used for HTML and AJAX requests. The navigated hook, fired
 * when the State is active, renders the data returned.
 */
function registerControllers(stateNavigator) {
    stateNavigator.states.people.navigating = function(data, url, navigate) {
        require.ensure(['./People'], function(require) {
            stateNavigator.states.people.component = require('./People').Listing;
            getProps(url, navigate)
        });
    }
    
    stateNavigator.states.person.navigating = function(data, url, navigate) {
        require.ensure(['./Person'], function(require) {
            stateNavigator.states.person.component = require('./Person').Details;
            getProps(url, navigate)
        });
    }
    
    stateNavigator.states.people.navigated = 
    stateNavigator.states.person.navigated = function(data, asyncData) {
        render(stateNavigator, asyncData);
    }
}

function getProps(url, navigate) {
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


