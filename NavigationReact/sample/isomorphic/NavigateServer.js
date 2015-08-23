var Navigation = require('../../../build/dist/Navigation');
var Listing = require('./Listing');
var StateInfoConfig = require('./StateInfoConfig');
var React = require('../react');

StateInfoConfig.register();
var states = Navigation.StateInfoConfig.dialogs.masterDetails.states;

states.listing.render = function(){
	return React.renderToString(React.createElement(Listing));	
}

exports.render = function(){
	return Navigation.StateContext.state.render();
}