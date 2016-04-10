/**
 * Adds React and Data modules to prevent them from appearing in the People
 * and Person component webpack bundles
 */
var Data = require('./Data');
var Navigation = require('navigation');
var NavigationReact = require('navigation-react');
var React = require('react');
var ReactDOM = require('react-dom');

/**
 * Configures the states for the two views.
 */
var stateNavigator = new Navigation.StateNavigator([
    {key: 'people', route: '{pageNumber?}', defaults: {pageNumber: 1 }},
    {key: 'person', route: 'person/{id}', defaults: {id: 0 }, trackCrumbTrail: true}
]);

/**
 * Attaches the navigating hooks to the two States. Fired just before the State
 * becomes active, it uses webpack's code splitting to load the respective
 * component on demand. When the component returns it creates the navigated
 * hooks and then continues with the navigation.
 */
stateNavigator.states.people.navigating = function(data, url, navigate) {
    require.ensure(['./People'], function(require) {
        var People = require('./People');
        People.createController(stateNavigator);
        navigate();
    });
}
stateNavigator.states.person.navigating = function(data, url, navigate) {
    require.ensure(['./Person'], function(require) {
        var Person = require('./Person');
        Person.createController(stateNavigator);
        navigate();
    });
}

stateNavigator.start();
