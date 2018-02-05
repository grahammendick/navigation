var path = require('path');

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.join(__dirname, "src", "js"),
        filename: "app.js"
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }    
};