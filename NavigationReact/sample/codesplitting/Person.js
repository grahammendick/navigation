var Data = require('./Data');
var React = require('react');
var ReactDOM = require('react-dom');
var NavigationReact = require('navigation-react');
var NavigationBackLink = NavigationReact.NavigationBackLink;

/**
 * Attaches the navigated hook to the Person State. Fired when the State is
 * active, it renders the Details Component into the content div.
 * If you were doing server rendering you could set the component onto the
 * State instead so that it's available to both the client and server code, 
 * e.g., stateNavigator.states.person.state = Component.Details
 */
exports.createController = function(stateNavigator) {
    stateNavigator.states.person.navigated = function(data) {
        var person = Data.getPerson(data.id);
        ReactDOM.render(
            React.createElement(Details, {person: person, stateNavigator: stateNavigator}),
            document.getElementById('content')
        );		
    }
}

var Details = React.createClass({
    render: function() {
        var person = this.props.person;
        return (
            React.createElement("div", {id: "details"}, 
                React.createElement(NavigationBackLink, {distance: 1, stateNavigator: this.props.stateNavigator}, "People"), 
                React.createElement("div", {id: "info"}, 
                    React.createElement("h2", null, person.name), 
                    React.createElement("div", {className: "label"}, "Date of Birth"), 
                    React.createElement("div", null, person.dateOfBirth), 
                    React.createElement("div", {className: "label"}, "Email"), 
                    React.createElement("div", null, person.email), 
                    React.createElement("div", {className: "label"}, "Phone"), 
                    React.createElement("div", null, person.phone)
                )
            )
        );
    }
})
