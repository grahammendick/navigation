var http = require('http');
var React = require('react');
var Navigation = require('navigation');
var NavigateClient = require('./NavigateClient');
var NavigateServer = require('./NavigateServer');
var browserify = require('browserify');

http.createServer(function(req, res) {
	if (req.url === '/favicon.ico') {
		res.end();
		return;
	}
	if (req.url === '/bundle.js') {
		browserify('./NavigationReact/sample/isomorphic/NavigateClient.js', { standalone: 'NavigateClient' })
			.bundle()
			.pipe(res)
		return;
	}
	Navigation.StateController.navigateLink(req.url);
	NavigateServer.getProps(function(props){
		Navigation.StateController.navigateLink(req.url);
		res.write('<html><head><style>')
		res.write('table{border-collapse:collapse;}table,td,th{border:1px #000 solid;}')
		res.write('</style></head><body><div id="content">')
		res.write(React.renderToString(React.createElement(NavigateServer.getContent(), props)));
		res.write('</div><script src="/bundle.js" ></script><script>')
		res.write('NavigateClient.start(' + JSON.stringify(props) + ');');
		res.write('</script></body></html>')
		res.end();
	});
}).listen(8080);
