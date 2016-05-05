var React = require('react');
var Navigation = require('navigation');
var People = require('./People');
var Person = require('./Person');

/**
 * Configures the states for the two views.
 */
exports.getStateNavigator = function() {
    return new Navigation.StateNavigator([
        {key: 'people', route: '{pageNumber?}', defaults: {pageNumber: 1}},
        {key: 'person', route: 'person/{id}', defaults: {id: 0}, trackCrumbTrail: true}
    ], new Navigation.HTML5HistoryManager());
}

/**
 * Registers the components creators for the States.
 */
exports.registerComponents = function(stateNavigator) {
    stateNavigator.states.people.createComponent = function(data) {
        return React.createElement(People.Listing, data);
    }
    stateNavigator.states.person.createComponent = function(data, url, navigate) {
        return React.createElement(Person.Details, data);
    }
}
