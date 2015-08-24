var React = require('react');
var Navigation = require('navigation');
var NavigationShared = require('./NavigationShared');
var Listing = require('./Listing');

function registerNavigators() {
	var states = Navigation.StateInfoConfig.dialogs.masterDetails.states;
	states.listing.navigating = function(data, url, navigate) {
		getData('/data/search/' + data.pageNumber, function(data){
			navigate(data);
		})
	}
	
	states.listing.navigated = function(data, asyncData) {
		React.render(
			React.createElement(Listing, { people: asyncData }),
			document.getElementById('content')
		);
	}
	
	function getData(url, callback) {
		var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
			if (req.readyState === 4){
				callback(JSON.parse(req.responseText));
			}
		};
        req.open('get', url);
		req.setRequestHeader("Content-Type", "application/json");
        req.send(null);
	}
}

exports.start = function(props) {
	Navigation.start();
	React.render(React.createElement(NavigationShared.getContent(), props), document.getElementById('content'));
	registerNavigators();
}
