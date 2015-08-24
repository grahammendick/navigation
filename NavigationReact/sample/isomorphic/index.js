var http = require('http');
var browserify = require('browserify');
var React = require('react');
var Navigation = require('navigation');
var NavigationShared = require('./NavigationShared');
var NavigationServer = require('./NavigationServer');
var PersonSearch = require('./PersonSearch');

http.createServer(function(req, res) {
	if (handleStatic(req, res))
		return;
	if (handleAjax(req, res))
		return;
	Navigation.StateController.navigateLink(req.url);
	NavigationServer.getProps(function(props) {
		Navigation.StateController.navigateLink(req.url);
		res.write('<html><head><style>')
		res.write('table{border-collapse:collapse;}table,td,th{border:1px #000 solid;}')
		res.write('.label{margin-left:50px;width: 100px;float:left;}')
		res.write('</style></head><body><div id="content">')
		res.write(React.renderToString(React.createElement(NavigationShared.getComponent(), props)));
		res.write('</div><script src="/app.js" ></script><script>')
		res.write('NavigationClient.start(' + safeStringify(props) + ');');
		res.write('</script></body></html>')
		res.end();
	});
}).listen(8080);

function handleStatic(req, res) {
	if (req.url === '/favicon.ico') {
		res.statusCode = 404;
		res.end();
		return true;
	}
	if (req.url === '/app.js') {
		browserify('./NavigationClient.js', { standalone: 'NavigationClient' })
			.bundle()
			.pipe(res)
		return true;
	}
	return false;
}

function handleAjax(req, res) {
	var matches = req.url.match(/^\/data\/people\/(\d+)$/);
	if (matches) {
		PersonSearch.search(+matches[1], function(people){
			res.write(JSON.stringify(people));
			res.end();
		});
		return true;
	}
	matches = req.url.match(/^\/data\/person\/(\d+)$/);
	if (matches) {
		PersonSearch.getDetails(+matches[1], function(person){
			res.write(JSON.stringify(person));
			res.end();
		});
		return true;
	}
	return false;
}

function safeStringify(props) {
  return JSON.stringify(props).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}