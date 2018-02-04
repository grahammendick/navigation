module.exports = {
    entry: "./NavigationClient.js",
    output: {
        path: __dirname,
        filename: "js/app.js"
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }    
};