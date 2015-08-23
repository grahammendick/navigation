var Navigation = require('navigation');
var PersonSearch = require('./PersonSearch');

var states = Navigation.StateInfoConfig.dialogs.masterDetails.states;
states.listing.getProps = function(data, callback) {
	PersonSearch.search(data.pageNumber, function(people){
		callback({ people: people });
	});
}

states.details.getProps = function(data, callback) {
	PersonSearch.getDetails(data.id, function(person){
		callback({ person: person });
	});
}

exports.getProps = function(callback) {
	return Navigation.StateContext.state.getProps(Navigation.StateContext.data, callback);
}
