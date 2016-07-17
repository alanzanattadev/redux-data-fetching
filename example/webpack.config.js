var path = require('path');

module.exports = {
    entry: "./lib/index.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [{
          test: /\.js/,
          loader: "babel",
          exclude: [
            /node_modules\/redux\-request\-state\/node_modules/,
          ], include: [
            path.join(__dirname, "lib"),
            path.join(__dirname, '../lib'),
            /node_modules\/redux\-request\-state/,
          ],
          query: { presets: ['es2015', 'react']}
        }]
    },
    devtool: "eval"
};
