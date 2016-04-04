var React = require('react');
var Navigation = require('navigation');
var Component = require('./Component');

exports.getStateNavigator = function() {
    return new Navigation.StateNavigator([
        { key: 'people', route: '{pageNumber?}', component: Component.Listing, defaults: { pageNumber: 1 }},
        { key: 'person', route: 'person/{id}', component: Component.Details, defaults: { id: 0 }, trackCrumbTrail: true }
    ], new Navigation.HTML5HistoryManager());
}

// Return the Component for the active State 
exports.createComponent = function(stateNavigator, props) {
    var clonedProps = {stateNavigator: stateNavigator};
    for(var key in props)
        clonedProps[key] = props[key];
    return React.createElement(stateNavigator.stateContext.state.component, clonedProps);
}
