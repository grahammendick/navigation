var React = require('react');
var Navigation = require('navigation');

/**
 * Configures the states for the two views.
 */
exports.getStateNavigator = function() {
    return new Navigation.StateNavigator([
        {key: 'people', route: '{pageNumber?}', defaults: {pageNumber: 1}},
        {key: 'person', route: 'person/{id}', defaults: {id: 0}, trackCrumbTrail: true}
    ], new Navigation.HTML5HistoryManager());
}
