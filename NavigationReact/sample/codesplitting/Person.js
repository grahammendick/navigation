var Component = require('./Component');
var Data = require('./Data');
var React = require('react');
var ReactDOM = require('react-dom');

/**
 * Attaches the navigated hook to the Person State. Fired when the State is
 * active, it renders the Details Component into the content div.
 * If you were doing server rendering you could set the component onto the
 * State instead so that it's available to both the client and server code, 
 * e.g., stateNavigator.states.person.state = Component.Details
 */
exports.createController = function(stateNavigator) {
    stateNavigator.states.person.navigating = function(data, url, navigate) {
        navigate();
    }
    
    stateNavigator.states.person.navigated = function(data) {
        var person = Data.getPerson(data.id);
        ReactDOM.render(
            React.createElement(Component.Details, {person: person, stateNavigator: stateNavigator}),
            document.getElementById('content')
        );		
    }
}
