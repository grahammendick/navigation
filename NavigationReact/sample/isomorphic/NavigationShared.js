var Navigation = require('navigation');
var Component = require('./Component');

Navigation.settings.historyManager = new Navigation.HTML5HistoryManager();
Navigation.StateInfoConfig.build([
    { key: 'masterDetails', initial: 'listing', states: [
        { key: 'listing', route: '{pageNumber}', defaults: { pageNumber: 1 }, trackCrumbTrail: false, transitions: [
            { key: 'select', to: 'details' }]},
        { key: 'details', route: 'person/{id}', defaults: { id: 0 } }]
    }
]);

var states = Navigation.StateInfoConfig.dialogs.masterDetails.states;
states.listing.getComponent = function() {
	return Component.Listing;
}

states.details.getComponent = function() {
	return Component.Details;
}

exports.getComponent = function() {
	return Navigation.StateContext.state.getComponent();
}