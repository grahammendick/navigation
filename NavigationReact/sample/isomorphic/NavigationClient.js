var React = require('react');
var Navigation = require('navigation');
var NavigationShared = require('./NavigationShared');

exports.start = function(props) {
	// Set the Navigation context
	Navigation.start();
	// Pass in the JSON props emitted from the server
	render(props);
	// Add State Navigators
	registerNavigators();
}

function render(props) {
	// Create the Component for the active State
	var component = React.createElement(NavigationShared.getComponent(), props);
	// Render the Component
	React.render(
		component,
		document.getElementById('content')
	);		
}
	
function registerNavigators() {
	var states = Navigation.StateInfoConfig.dialogs.masterDetails.states;
	states.listing.navigating = function(data, url, navigate) {
		getData('/data/people/' + data.pageNumber, function(data){
			navigate(data);
		})
	}
	
	states.listing.navigated = function(data, asyncData) {
		render({ people: asyncData});
	}

	states.details.navigating = function(data, url, navigate) {
		getData('/data/person/' + data.id, function(data){
			navigate(data);
		})
	}
	
	states.details.navigated = function(data, asyncData) {
		render({ person: asyncData });
	}
}

function getData(url, callback) {
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.readyState === 4){
			callback(JSON.parse(req.responseText));
		}
	};
	req.open('get', url);
	req.send(null);
}
	

