import http from 'http';
import fs from 'fs';
import { graphql } from 'graphql';
import schema from './schema';
import webpack from 'webpack';

http.createServer(function(req, res) {
    if (handleStatic(req, res))
        return;
    var fullBody = '';    
    req.on('data', function(chunk) {
      fullBody += chunk.toString();
    });
    req.on('end', function() {
        graphql(schema, JSON.parse(fullBody))
            .then((result) => {
                res.write(JSON.stringify(result));
                res.end();
            });
    });    
}).listen(8080);


function handleStatic(req, res) {
    if (req.url === '/favicon.ico') {
        res.statusCode = 404;
        res.end();
        return true;
    }
    if (req.url === '/') {
        res.write(`<html>
            <head>
                <title>Navigation Relay</title>
                <style>
                    table{border-collapse:collapse;}
                    table,td,th{border:1px #000 solid;}
                    .label{margin-left:50px;width:100px;float:left;}
                </style>
            </head>
            <body>
                <div id="content"></div>
                <script src="/app.js" ></script>
            </body>
        </html>`);
        res.end();
        return true;
    }
    if (req.url === '/app.js') {
        webpack({
            entry: "./index.js",
            output: {
                path: __dirname,
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
        return true;
    }
    return false;
}
