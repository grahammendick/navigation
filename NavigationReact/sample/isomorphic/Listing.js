var React = require('react');
var NavigationReact = require('navigation-react');
var NavigationLink = NavigationReact.NavigationLink;
var RefreshLink = NavigationReact.RefreshLink;

module.exports = React.createClass({
	render: function() {
		var people = this.props.people.map(function (person) {
	        return (
                React.createElement("tr", null, 
                    React.createElement("td", null, React.createElement(NavigationLink, {action: "select", toData: { id: person.id}}, person.name)), 
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
                    React.createElement(RefreshLink, {toData: { pageNumber: 1}, disableActive: true}, "1"), 
                    React.createElement(RefreshLink, {toData: { pageNumber: 2}, disableActive: true}, "2")
                )
            )
        );
	}
})
