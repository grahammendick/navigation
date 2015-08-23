var http = require('http');
var Navigation = require('navigation');
var NavigateServer = require('./NavigateServer');

http.createServer(function(req, res) {
	if (req.url !== '/favicon.ico') {
		Navigation.StateController.navigateLink(req.url);
		NavigateServer.getProps(function(props){
			Navigation.StateController.navigateLink(req.url);
			res.write(NavigateServer.render(props));
			res.end();
		});
	} else {
		res.end();
	}
}).listen(8080);
