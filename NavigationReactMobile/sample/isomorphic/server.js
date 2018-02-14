import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { NavigationHandler } from 'navigation-react';
import { NavigationMotion } from 'navigation-react-mobile';
import getStateNavigator from './getStateNavigator';

var app = express();

app.use(express.static('js'))

app.get('/favicon.ico', function(req, res) {
    res.statusCode = 404;
    res.end();
});

app.get('*', function(req, res) {
    var stateNavigator = getStateNavigator();
    stateNavigator.start(req.url);
    res.send(`<html>
        <head>
            <title>Isomorphic Mobile Navigation</title>
            <style>
                table{border-collapse:collapse;}
                table,td,th{border:1px #000 solid;}
                .label{margin-left:50px;width:100px;float:left;}
                body{overflow: hidden;}
                .scene{position:fixed;left:0;right:0;top:0;bottom:0;overflow:auto;padding:10px;}
            </style>
        </head>
        <body>
            <div id="content">${ReactDOMServer.renderToString(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion
                        unmountedStyle={{opacity: 1, translate: 100}}
                        mountedStyle={{opacity: 1, translate: 0}}
                        crumbStyle={{opacity: 0, translate: 0}}>
                        {({opacity, translate}, scene, key, active) => (
                            <div key={key}
                                className="scene"
                                style={{
                                    opacity,
                                    transform: `translate(${translate}%)`,
                                }}>
                                {scene}
                            </div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>
            )}</div>
            <script src="/app.js" ></script>
        </body>
    </html>`);
});

app.listen(8080);
