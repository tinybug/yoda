var webpack = require("webpack");

module.exports = {
  entry: './src/scripts/main.js',
  output: {
    path: __dirname + '/src',
    filename: 'yoda.bundled.js'
  },
  target: 'atom',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }
};