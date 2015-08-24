var http = require('http');
var browserify = require('browserify');
var React = require('react');
var Navigation = require('navigation');
var NavigationShared = require('./NavigationShared');
var NavigationServer = require('./NavigationServer');
var PersonSearch = require('./PersonSearch');

http.createServer(function(req, res) {
	if (req.url === '/favicon.ico') {
		res.statusCode = 404;
		res.end();
		return;
	}
	if (req.url === '/app.js') {
		browserify('./NavigationClient.js', { standalone: 'NavigationClient' })
			.bundle()
			.pipe(res)
		return;
	}
	var matches = req.url.match(/^\/data\/people\/(\d+)$/);
	if (matches) {
		PersonSearch.search(+matches[1], function(people){
			res.write(JSON.stringify(people));
			res.end();
		});
		return;
	}
	matches = req.url.match(/^\/data\/person\/(\d+)$/);
	if (matches) {
		PersonSearch.getDetails(+matches[1], function(person){
			res.write(JSON.stringify(person));
			res.end();
		});
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