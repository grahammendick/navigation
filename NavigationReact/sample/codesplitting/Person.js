var Component = require('./Component');
var Data = require('./Data');
var React = require('react');
var ReactDOM = require('react-dom');

exports.createController = function(stateNavigator) {
    stateNavigator.states.person.navigated = function(data) {
        var person = Data.getPerson(data.id);
        ReactDOM.render(
            React.createElement(Component.Details, {person: person, stateNavigator: stateNavigator}),
            document.getElementById('content')
        );		
    }
}
