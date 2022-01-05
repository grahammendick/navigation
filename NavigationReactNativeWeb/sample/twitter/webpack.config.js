var path = require('path');

module.exports = {
    mode: 'development',
    entry: "./index.web.js",
    output: {
        path: __dirname,
        filename: "app.web.js"
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, use: { loader: 'babel-loader' } },
            { test: /\.(png|jpe?g)$/, use: { loader: 'url-loader', options: { name: "[name].[ext]", esModule: false } } },
        ]
    },
    resolve: {
        alias: {
            'react-native$': 'react-native-web',
            'navigation-react-native$': 'navigation-react-native-web',
        }
    }
};