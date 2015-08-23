var http = require('http');
var React = require('react');
var Navigation = require('navigation');
var NavigationShared = require('./NavigationShared');
var NavigationServer = require('./NavigationServer');
var browserify = require('browserify');

http.createServer(function(req, res) {
	if (req.url === '/favicon.ico') {
		res.end();
		return;
	}
	if (req.url === '/app.js') {
		browserify('./NavigationClient.js', { standalone: 'NavigationClient' })
			.bundle()
			.pipe(res)
		return;
	}
	Navigation.StateController.navigateLink(req.url);
	NavigationServer.getProps(function(props){
		Navigation.StateController.navigateLink(req.url);
		res.write('<html><head><style>')
		res.write('table{border-collapse:collapse;}table,td,th{border:1px #000 solid;}')
		res.write('</style></head><body><div id="content">')
		res.write(React.renderToString(React.createElement(NavigationShared.getContent(), props)));
		res.write('</div><script src="/app.js" ></script><script>')
		res.write('NavigationClient.start(' + safeStringify(props) + ');');
		res.write('</script></body></html>')
		res.end();
	});
}).listen(8080);

function safeStringify(props) {
  return JSON.stringify(props).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}