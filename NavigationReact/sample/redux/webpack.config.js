module.exports = {
    entry: "./index.js",
    output: {
        path: __dirname,
        filename: "app.js"
    },
    loaders: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]    
};