var React = require('react');
var Navigation = require('navigation');
var Listing = require('./Listing');
var Details = require('./Details');
var StateInfoConfig = require('./StateInfoConfig');

StateInfoConfig.register();

var states = Navigation.StateInfoConfig.dialogs.masterDetails.states;
states.listing.getContent = function() {
	return Listing;
}

exports.start = function(props) {
	Navigation.settings.historyManager = new Navigation.HTML5HistoryManager();
	Navigation.start();
	React.render(React.createElement(Navigation.StateContext.state.getContent(), props), document.getElementById('content'));
}
