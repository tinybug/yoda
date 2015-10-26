var webpack = require("webpack");

module.exports = {
  entry: {
    yoda: './src/scripts/main.js',
    player: './src/scripts/player.js'
  },
  output: {
    path: __dirname + '/build',
    filename: '[name].bundled.js'
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