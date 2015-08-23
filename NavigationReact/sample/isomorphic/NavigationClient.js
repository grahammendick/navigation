var React = require('react');
var Navigation = require('navigation');
var NavigationShared = require('./NavigationShared');

function registerNavigators() {
	var states = Navigation.StateInfoConfig.dialogs.masterDetails.states;
	states.listing.navigated = function(data) {
	}	
}

exports.start = function(props) {
	Navigation.start();
	React.render(React.createElement(NavigationShared.getContent(), props), document.getElementById('content'));
	registerNavigators();
}
