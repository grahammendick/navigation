var http = require('http');
var React = require('react');
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
			var content = NavigateServer.getContent();
			res.write(React.renderToString(React.createElement(content.component, props)));
			res.write('</div><script>')
			res.write('var component = ' + content.name + ';');
			res.write('var props = ' + JSON.stringify(props) + ';');
			res.write('</script></body></html>')
			res.end();
		});
	} else {
		res.end();
	}
}).listen(8080);
