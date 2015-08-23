var http = require('http');
var Navigation = require('../../../build/dist/Navigation');
var StateInfoConfig = require('./StateInfoConfig');

StateInfoConfig.register();

var server = http.createServer(function(req, res) {
	Navigation.StateController.navigateLink(req.url);
	res.write(Navigation.StateContext.state.key);
	res.end();
});

server.listen(8080);