var Component = require('./Component');
var Data = require('./Data');
var React = require('react');
var ReactDOM = require('react-dom');

exports.createController = function(stateNavigator) {
    stateNavigator.states.people.navigated = function(data) {
        var people = Data.searchPeople(data.pageNumber);
        ReactDOM.render(
            React.createElement(Component.Listing, {people: people, stateNavigator: stateNavigator}),
            document.getElementById('content')
        );		
    }
}
