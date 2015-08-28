var Navigation = require('navigation');
var Component = require('./Component');

Navigation.settings.historyManager = new Navigation.HTML5HistoryManager();
// Configure the Dialogs, States and Transitions
Navigation.StateInfoConfig.build([
    { key: 'masterDetails', initial: 'listing', states: [
        { key: 'listing', route: '{pageNumber}', component: Component.Listing, defaults: { pageNumber: 1 }, trackCrumbTrail: false, transitions: [
            { key: 'select', to: 'details' }]},
        { key: 'details', route: 'person/{id}', component: Component.Details, defaults: { id: 0 } }]
    }
]);

// Return the Component for the active State 
exports.getComponent = function() {
	return Navigation.StateContext.state.component;
}
