var Component = require('./Component');
var Data = require('./Data');
var Navigation = require('navigation');
var React = require('react');
var ReactDOM = require('react-dom');

exports.configure = function(stateNavigator) {
    stateNavigator.configure([
        {key: 'people', route: '{pageNumber?}', defaults: {pageNumber: 1 }},
        {key: 'person', route: 'person/{id}', defaults: {id: 0 }}
    ]);
    
    stateNavigator.states.people.navigated = function(data) {
        var people = Data.searchPeople(data.pageNumber);
        ReactDOM.render(
            React.createElement(Component.Listing, {people: people, stateNavigator: stateNavigator}),
            document.getElementById('content')
        );		
    }

    stateNavigator.states.person.navigated = function(data) {
        var person = Data.getPerson(data.id);
        ReactDOM.render(
            React.createElement(Component.Details, {person: person, stateNavigator: stateNavigator}),
            document.getElementById('content')
        );		
    }
    return stateNavigator;
}
