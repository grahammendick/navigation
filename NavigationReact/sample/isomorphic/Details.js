var React = require('react');
var NavigationReact = require('navigation-react');
var NavigationBackLink = NavigationReact.NavigationBackLink;

module.exports = React.createClass({
    render: function() {
        var person = this.props.person;
        	return (
            React.createElement("div", {id: "details"}, 
                React.createElement(NavigationBackLink, {distance: 1}, "People"), 
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
