var http = require('http');
var fs = require('fs');
var webpack = require('webpack');
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var Navigation = require('navigation');
var NavigationShared = require('./NavigationShared');
var Data = require('./Data');
var People = require('./People');
var Person = require('./Person');

/**
 * A single set of routes handles both the HTML and AJAX requests. Uses
 * content negotiation, based on the content-type header, to decide 
 * whether to return HTML or JSON.
 * Creates a State Navigator, passes it the current Url and then retrieves
 * the props for the current State. If it's an AJAX request it returns the
 * props as JSON. If it's an HTML request it creates the component for the
 * current State and returns the rendered HTML with the JSON props inlined.
 */
http.createServer(function(req, res) {
    if (handleStatic(req, res))
        return;
    var stateNavigator = NavigationShared.getStateNavigator();
    registerControllers(stateNavigator);
    People.registerComponent(stateNavigator);
    Person.registerComponent(stateNavigator);    
    stateNavigator.onNavigate(function(oldState, state) {
        res.setHeader('vary', 'content-type');
        if (req.headers['content-type'] === 'application/json') {
            res.write(JSON.stringify(state.props));
        } else {
            var props = safeStringify(state.props);
            state.props.stateNavigator = stateNavigator;
            var component = state.createComponent(state.props);
            res.write(`<html>
                <head>
                    <title>Isomorphic Navigation Code Splitting</title>
                    <style>
                        table{border-collapse:collapse;}
                        table,td,th{border:1px #000 solid;}
                        .label{margin-left:50px;width:100px;float:left;}
                    </style>
                </head>
                <body>
                    <div id="content">${ReactDOMServer.renderToString(component)}</div>
                    <script>var serverProps = ${props};</script>
                    <script src="/app.js" ></script>
                </body>
            </html>`);
        }
        res.end();
    });
    stateNavigator.start(req.url);
}).listen(8080);

/**
 * Attaches the navigation hooks to the two States. The navigating hook, fired
 * just before the State becomes active, calls into the data layer and adds the 
 * retrieved person data onto the state 
 */
function registerControllers(stateNavigator, callback) {
    stateNavigator.states.people.navigating = function(data, url, navigate) {
        Data.searchPeople(data.pageNumber, function(people) {
            stateNavigator.states.people.props = {people: people};
            navigate();
        });
    }
    stateNavigator.states.person.navigating = function(data, url, navigate) {
        Data.getPerson(data.id, function(person) {
            stateNavigator.states.person.props = {person: person};
            navigate();
        });
    }
}

/**
 * Dynamically runs webpack to slow down the JavaScript and make the isomorphic
 * functionality clearly visible. Don't copy this, webpack should be part of
 * the build step. 
 */
function handleStatic(req, res) {
    if (req.url === '/favicon.ico') {
        res.statusCode = 404;
        res.end();
        return true;
    }
    if (req.url === '/app.js') {
        webpack({
            entry: "./NavigationClient.js",
            output: {
                path: __dirname,
                filename: "app.js"
            }
        }, function(err, stats) {
            fs.createReadStream('./app.js')
                .pipe(res);
        })
        return true;
    }
    var matches = req.url.match(/(\d+)\.app\.js$/);
    if (matches) {
        fs.createReadStream('./' + matches[1] + '.app.js')
            .pipe(res);
        return true;
    }
    return false;
}

function safeStringify(props) {
  return JSON.stringify(props).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}