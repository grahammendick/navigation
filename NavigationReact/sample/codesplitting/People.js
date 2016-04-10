var Component = require('./Component');
var Data = require('./Data');
var React = require('react');
var ReactDOM = require('react-dom');

/**
 * Attaches the navigated hook to the People State. Fired when the State is
 * active, it renders the Listing Component into the content div.
 * If you were doing server rendering you could set the component onto the
 * State instead so that it's available to both the client and server code, 
 * e.g., stateNavigator.states.people.state = Component.Listing
 */
exports.createController = function(stateNavigator) {
    stateNavigator.states.people.navigating = function(data, url, navigate) {
        navigate();
    }
    
    stateNavigator.states.people.navigated = function(data) {
        var people = Data.searchPeople(data.pageNumber);
        ReactDOM.render(
            React.createElement(Component.Listing, {people: people, stateNavigator: stateNavigator}),
            document.getElementById('content')
        );		
    }
}
