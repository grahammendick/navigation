module.exports = {
    mode: 'development',
    entry: "./index.js",
    output: {
        path: __dirname,
        filename: "app.js"
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, use: { loader: 'babel-loader' } }
        ]
    },
};