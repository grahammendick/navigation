var React = require('react');
var Navigation = require('navigation');
var Listing = require('./Listing');
var Details = require('./Details');
var StateInfoConfig = require('./StateInfoConfig');
var PersonSearch = require('./PersonSearch');

Navigation.settings.historyManager = new Navigation.HTML5HistoryManager();
StateInfoConfig.register();
var states = Navigation.StateInfoConfig.dialogs.masterDetails.states;

states.listing.getProps = function(data, callback) {
	PersonSearch.search(data.pageNumber, function(people){
		callback({ people: people });
	})
}

states.listing.render = function(props) {
	return React.renderToString(React.createElement(Listing, props));
}

states.details.getProps = function(data, callback) {
	PersonSearch.getDetails(data.id, function(person){
		callback({ person: person });
	})
}

states.details.render = function(props) {
	return React.renderToString(React.createElement(Details, props));
}

exports.getProps = function(callback) {
	return Navigation.StateContext.state.getProps(Navigation.StateContext.data, callback);
}

exports.render = function(props) {
	return Navigation.StateContext.state.render(props);
}