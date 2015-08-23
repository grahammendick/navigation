var React = require('react');
var Navigation = require('navigation');
var NavigationShared = require('./NavigationShared');

exports.start = function(props) {
	Navigation.start();
	React.render(React.createElement(NavigationShared.getContent(), props), document.getElementById('content'));
}
