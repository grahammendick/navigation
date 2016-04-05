module.exports = {
    entry: "./index.js",
    output: {
        path: __dirname,
        filename: "app.js",
        chunkFilename: "[name].chunk.js"
    }
};