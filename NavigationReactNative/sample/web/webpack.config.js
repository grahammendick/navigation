module.exports = {
    entry: {
        medley: "./medley/index.js",
        zoom: "./zoom/index.js"
    },
    output: {
        path: __dirname,
        filename: "[name]/app.js"
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }    
};
