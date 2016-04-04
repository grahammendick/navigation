var Navigation = require('navigation');
var Component = require('./Component');

exports.getStateNavigator = function() {
    return new Navigation.StateNavigator([
        { key: 'people', route: '{pageNumber?}', component: Component.Listing, defaults: { pageNumber: 1 }},
        { key: 'person', route: 'person/{id}', component: Component.Details, defaults: { id: 0 }, trackCrumbTrail: true }
    ], new Navigation.HTML5HistoryManager());
}

// Return the Component for the active State 
exports.getComponent = function(stateNavigator) {
	return stateNavigator.stateContext.state.component;
}
