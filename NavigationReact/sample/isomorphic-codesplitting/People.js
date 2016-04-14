var React = require('react');
var NavigationReact = require('navigation-react');
var NavigationLink = NavigationReact.NavigationLink;
var RefreshLink = NavigationReact.RefreshLink;

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
