var React = require('react');
var ReactDOM = require('react-dom');
var Navigation = require('navigation');
var NavigationShared = require('./NavigationShared');

/**
 * Creates and starts a State Navigator. Before registering the controllers
 * that handling navigation, does an initial render for the current State
 * using the props returned from the server. 
 */
exports.start = function(props) {
    var stateNavigator = NavigationShared.getStateNavigator();
    stateNavigator.start();
    render(stateNavigator, props);
    registerControllers(stateNavigator);
}

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
    stateNavigator.states.people.navigating = 
    stateNavigator.states.person.navigating = function(data, url, navigate) {
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
    stateNavigator.states.people.navigated = 
    stateNavigator.states.person.navigated = function(data, asyncData) {
        render(stateNavigator, asyncData);
    }
}
    

