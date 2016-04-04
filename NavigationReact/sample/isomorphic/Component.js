var React = require('react');
var NavigationReact = require('navigation-react');
var NavigationLink = NavigationReact.NavigationLink;
var RefreshLink = NavigationReact.RefreshLink;
var NavigationBackLink = NavigationReact.NavigationBackLink;

exports.Listing = React.createClass({
	render: function() {
        var stateNavigator = this.props.stateNavigator;
		var people = this.props.people.map(function (person) {
	        return (
                React.createElement("tr", {key: person.id}, 
                    React.createElement("td", null, React.createElement(NavigationLink, {stateKey: "person", navigationData: {id: person.id}, stateNavigator: stateNavigator}, person.name)), 
                    React.createElement("td", null, person.dateOfBirth)
                )
            );
        });
        return (
            React.createElement("div", {id: "listing"}, 
                React.createElement("table", null, 
                    React.createElement("thead", null, 
                        React.createElement("tr", null, 
                            React.createElement("th", null, "Name"), 
                            React.createElement("th", null, "Date of Birth")
                        )
                    ), 
                    React.createElement("tbody", null, people)
                ), 
                React.createElement("div", {id: "pager"}, 
                    "Go to page", 
                    React.createElement(RefreshLink, {navigationData: {pageNumber: 1}, disableActive: true, stateNavigator: stateNavigator}, "1"), 
                    React.createElement(RefreshLink, {navigationData: {pageNumber: 2}, disableActive: true, stateNavigator: stateNavigator}, "2")
                )
            )
        );
	}
})

exports.Details = React.createClass({
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
