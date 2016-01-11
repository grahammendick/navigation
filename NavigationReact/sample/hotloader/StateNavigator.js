var Component = require('./Component');
var Data = require('./Data');
var Navigation = require('navigation');
var React = require('react');
var ReactDOM = require('react-dom');

exports.configureStateNavigator = function() {
    var masterDetails = Navigation.StateInfoConfig.dialogs.masterDetails;

    masterDetails.states.listing.navigated = function(data) {
        var people = Data.searchPeople(data.pageNumber);
        ReactDOM.render(
            React.createElement(Component.Listing, { people: people }),
            document.getElementById('content')
        );		
    }

    masterDetails.states.details.navigated = function(data) {
        var person = Data.getPerson(data.id);
        ReactDOM.render(
            React.createElement(Component.Details, { person: person }),
            document.getElementById('content')
        );		
    }
}
