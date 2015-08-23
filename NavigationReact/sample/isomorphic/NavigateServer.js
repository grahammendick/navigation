var Navigation = require('../../../build/dist/Navigation');
var Listing = require('./Listing');
var StateInfoConfig = require('./StateInfoConfig');
var React = require('../react');

StateInfoConfig.register();
var states = Navigation.StateInfoConfig.dialogs.masterDetails.states;

states.listing.getProps = function(data){
	return { people: data.pageNumber };
}

states.listing.render = function(props){
	return React.renderToString(React.createElement(Listing, props));
}

exports.getProps = function(){
	return Navigation.StateContext.state.getProps(Navigation.StateContext.data);
}
exports.render = function(props){
	return Navigation.StateContext.state.render(props);
}