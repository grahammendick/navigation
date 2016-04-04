var React = require('react');
var ReactDOM = require('react-dom');
var Navigation = require('navigation');
var NavigationShared = require('./NavigationShared');

exports.start = function(props) {
    var stateNavigator = NavigationShared.getStateNavigator();
    // Set the Navigation context
    stateNavigator.start();
    // Pass in the JSON props emitted from the server
    render(stateNavigator, props);
    // Add State Controllers
    registerControllers(stateNavigator);
}

function render(stateNavigator, props) {
    // Create the Component for the active State
    var component = NavigationShared.createComponent(stateNavigator, props);
    // Render the Component
    ReactDOM.render(
        component,
        document.getElementById('content')
    );        
}
    
function registerControllers(stateNavigator) {
    for(var key in stateNavigator.states) {
        var state = stateNavigator.states[key];
        state.navigating = function(data, url, navigate) {
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
        state.navigated = function(data, asyncData) {
            render(stateNavigator, asyncData);
        }
    }
}
    

