var webpack = require('webpack')
var webpackTargetElectronRenderer = require('webpack-target-electron-renderer');

var options = {
  entry: "./app/index.js",
  output: {
    path: __dirname + '/static',
    filename: "app.js"
  },
  devtool: "source-map",
  module: {
    preLoaders: [
      { test: /\.json$/, loader: 'json'}
    ],
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
};

options.target = webpackTargetElectronRenderer(options);

module.exports = options;