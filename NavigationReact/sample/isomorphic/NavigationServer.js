var http = require('http');
var browserify = require('browserify');
var React = require('react');
var Navigation = require('navigation');
var NavigationShared = require('./NavigationShared');
var Data = require('./Data');

http.createServer(function(req, res) {
	if (handleStatic(req, res))
		return;
	if (handleAjax(req, res))
		return;
	// Set the Navigation context
	Navigation.StateController.navigateLink(req.url);
	// Get the props data for the active State
	getProps(function(props) {
		// Reset the Navigation context
		Navigation.StateController.navigateLink(req.url);
		res.write('<html><head><style>')
		res.write('table{border-collapse:collapse;}table,td,th{border:1px #000 solid;}')
		res.write('.label{margin-left:50px;width: 100px;float:left;}')
		res.write('</style></head><body><div id="content">')
		// Create the Component for the active State
		var component = React.createElement(NavigationShared.getComponent(), props);
		// Render the Component to the response
		res.write(React.renderToString(component));
		res.write('</div><script src="/app.js" ></script><script>')
		// Write the props as JSON to the response
		res.write('NavigationClient.start(' + safeStringify(props) + ');');
		res.write('</script></body></html>')
		res.end();
	});
}).listen(8080);

var states = Navigation.StateInfoConfig.dialogs.masterDetails.states;
states.listing.getProps = function(data, callback) {
	Data.searchPeople(data.pageNumber, function(people){
		callback({ people: people });
	});
}

states.details.getProps = function(data, callback) {
	Data.getPerson(data.id, function(person){
		callback({ person: person });
	});
}

// Return the props data for the active State 
function getProps(callback) {
	return Navigation.StateContext.state.getProps(Navigation.StateContext.data, callback);
}

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
		Data.searchPeople(+matches[1], function(people){
			res.write(JSON.stringify(people));
			res.end();
		});
		return true;
	}
	matches = req.url.match(/^\/data\/person\/(\d+)$/);
	if (matches) {
		Data.getPerson(+matches[1], function(person){
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