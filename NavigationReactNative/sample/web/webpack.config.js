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
            { test: /\.js$/, exclude: /node_modules/, use: { loader: 'babel-loader' } }
        ]
    },
    resolve: {
        alias: {
            'react-native$': 'react-native-web',
            'navigation-react-native$': path.resolve(__dirname, 'navigation-react-native-web.js'),

        }
    }
};