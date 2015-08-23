var http = require('http');
var Navigation = require('navigation');
var NavigateServer = require('./NavigateServer');

http.createServer(function(req, res) {
	if (req.url !== '/favicon.ico') {
		Navigation.StateController.navigateLink(req.url);
		NavigateServer.getProps(function(props){
			Navigation.StateController.navigateLink(req.url);
			res.write('<html><head><style>')
			res.write('table{border-collapse:collapse;}table,td,th{border:1px #000 solid;}')
			res.write('</style></head><body><div id="content">')
			res.write(NavigateServer.render(props));
			res.write('</div></body></html>')
			res.end();
		});
	} else {
		res.end();
	}
}).listen(8080);
