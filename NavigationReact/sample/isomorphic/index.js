var http = require('http');
var Navigation = require('../../../build/dist/Navigation');
var NavigateServer = require('./NavigateServer');

var server = http.createServer(function(req, res) {
	if (req.url !== '/favicon.ico') {
		Navigation.StateController.navigateLink(req.url);
		res.write(NavigateServer.render());
	}
	res.end();
});

server.listen(8080);