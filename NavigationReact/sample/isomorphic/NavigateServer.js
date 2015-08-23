var Navigation = require('navigation');
var Listing = require('./Listing');
var StateInfoConfig = require('./StateInfoConfig');
var React = require('react');
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

exports.getProps = function(callback) {
	return Navigation.StateContext.state.getProps(Navigation.StateContext.data, callback);
}

exports.render = function(props) {
	return Navigation.StateContext.state.render(props);
}