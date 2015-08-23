var http = require('http');
var Navigation = require('../../../build/dist/Navigation');
var StateInfoConfig = require('./StateInfoConfig');
var Listing = require('./Listing');
var React = require('../react');

StateInfoConfig.register();

var server = http.createServer(function(req, res) {
	Navigation.StateController.navigateLink(req.url);
	res.write(React.renderToString(React.createElement(Listing)));
	res.end();
});

server.listen(8080);