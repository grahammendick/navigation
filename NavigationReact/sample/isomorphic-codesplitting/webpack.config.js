var path = require('path');

module.exports = {
    entry: "./NavigationClient.js",
    output: {
        path: path.join(__dirname, "js"),
        filename: "app.js"
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }    
};