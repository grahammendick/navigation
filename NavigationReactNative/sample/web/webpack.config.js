module.exports = {
    entry: "./medley/index.js",
    output: {
        path: __dirname,
        filename: "medley/app.js"
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }    
};
