var Navigation = require('navigation');
var Component = require('./Component');

Navigation.settings.historyManager = new Navigation.HTML5HistoryManager();
// Configure the Dialogs, States and Transitions
Navigation.StateInfoConfig.build([
    { key: 'masterDetails', initial: 'listing', states: [
        { key: 'listing', route: '{pageNumber}', defaults: { pageNumber: 1 }, trackCrumbTrail: false, transitions: [
            { key: 'select', to: 'details' }]},
        { key: 'details', route: 'person/{id}', defaults: { id: 0 } }]
    }
]);

// Return the Component for the active State 
exports.getComponent = function() {
	return Navigation.StateContext.state.getComponent();
}

var states = Navigation.StateInfoConfig.dialogs.masterDetails.states;
states.listing.getComponent = function() {
	return Component.Listing;
}

states.details.getComponent = function() {
	return Component.Details;
}
