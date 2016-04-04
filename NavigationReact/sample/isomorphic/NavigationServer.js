var http = require('http');
var browserify = require('browserify');
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var Navigation = require('navigation');
var NavigationShared = require('./NavigationShared');
var Data = require('./Data');

http.createServer(function(req, res) {
	if (handleStatic(req, res))
		return;
    var stateNavigator = NavigationShared.getStateNavigator();
    registerPropAccessors(stateNavigator);
	// Set the Navigation context
	stateNavigator.start(req.url);
	// Get the props data for the active State
	getProps(stateNavigator, function(props) {
		res.setHeader('vary', 'content-type');
		if (req.headers['content-type'] === 'application/json') {
			res.write(JSON.stringify(props));
		} else {
			res.write('<html><head><style>')
			res.write('table{border-collapse:collapse;}table,td,th{border:1px #000 solid;}')
			res.write('.label{margin-left:50px;width: 100px;float:left;}')
			res.write('</style></head><body><div id="content">')
			// Create the Component for the active State
            props.stateNavigator = stateNavigator;
			var component = React.createElement(NavigationShared.getComponent(stateNavigator), props);
            delete props.stateNavigator;
			// Render the Component to the response
			res.write(ReactDOMServer.renderToString(component));
			res.write('</div><script src="/app.js" ></script><script>')
			// Write the props as JSON to the response
			res.write('NavigationClient.start(' + safeStringify(props) + ');');
			res.write('</script></body></html>')
		}
		res.end();
	});
}).listen(8080);

// Return the props data for the active State 
function getProps(stateNavigator, callback) {
	return stateNavigator.stateContext.state.getProps(stateNavigator.stateContext.data, callback);
}

function registerPropAccessors(stateNavigator) {
    stateNavigator.states.people.getProps = function(data, callback) {
        Data.searchPeople(data.pageNumber, function(people){
            callback({ people: people });
        });
    }

    stateNavigator.states.person.getProps = function(data, callback) {
        Data.getPerson(data.id, function(person){
            callback({ person: person });
        });
    }
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

function safeStringify(props) {
  return JSON.stringify(props).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}