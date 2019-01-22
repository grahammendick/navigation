module.exports = {
    mode: 'development',
    entry: "./index.web.js",
    output: {
        path: __dirname,
        filename: "web_app.js"
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, use: { loader: 'babel-loader' } }
        ]
    },
    resolve: {
        alias: {
            'react-native$': 'react-native-web'
        }
    }
};