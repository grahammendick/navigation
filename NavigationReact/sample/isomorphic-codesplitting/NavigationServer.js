import express from 'express';
import fs from 'fs';
import webpack from 'webpack';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import getStateNavigator from './NavigationShared';
import { searchPeople, getPerson } from './Data';
import { registerComponent as registerPeopleComponent } from './People';
import { registerComponent as registerPersonComponent } from './Person';

var app = express();

/**
 * Dynamically runs webpack to slow down the JavaScript and make the isomorphic
 * functionality clearly visible. Don't copy this, webpack should be part of
 * the build step. 
 */
app.get('/app.js', function (req, res) {
    webpack({
        entry: "./NavigationClient.js",
        output: {
            path: __dirname,
            publicPath: '/',
            filename: "app.js"
        },
        module: {
            loaders: [
                { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
            ]
        }
    }, function(err, stats) {
        fs.createReadStream('./app.js')
            .pipe(res);
    })
});

app.get('/:id(\\d+).app.js', function (req, res) {
    fs.createReadStream('./' + req.params.id + '.app.js')
        .pipe(res);
});

/**
 * A single set of routes handles both the HTML and AJAX requests. Uses
 * content negotiation, based on the content-type header, to decide 
 * whether to return HTML or JSON.
 * Creates a State Navigator, passes it the current Url and then retrieves
 * the props for the current State. If it's an AJAX request it returns the
 * props as JSON. If it's an HTML request it creates the component for the
 * current State and returns the rendered HTML with the JSON props inlined.
 */
app.get('*', function (req, res) {
    var stateNavigator = getStateNavigator();
    registerControllers(stateNavigator);
    registerPeopleComponent(stateNavigator);
    registerPersonComponent(stateNavigator);    
    stateNavigator.onNavigate(function(oldState, state, data, asyncData) {
        res.set('vary', 'content-type');
        if (req.get('content-type') === 'application/json') {
            res.send(JSON.stringify(asyncData));
        } else {
            var props = safeStringify(asyncData);
            asyncData.stateNavigator = stateNavigator;
            var component = state.createComponent(asyncData);
            res.send(`<html>
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
    });
    stateNavigator.start(req.url);
});

app.listen(8080);

/**
 * Attaches the navigation hooks to the two States. The navigating hook, fired
 * just before the State becomes active, calls into the data layer and adds the 
 * retrieved person data onto the state 
 */
function registerControllers(stateNavigator, callback) {
    stateNavigator.states.people.navigating = function(data, url, navigate) {
        searchPeople(data.pageNumber, function(people) {
            navigate({people: people});
        });
    }
    stateNavigator.states.person.navigating = function(data, url, navigate) {
        getPerson(data.id, function(person) {
            navigate({person: person});
        });
    }
}

function safeStringify(props) {
  return JSON.stringify(props).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--');
}