var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

module.exports = {
  devServer: {
    watchOptions: {
      poll: true
    }
  },

  entry: './src/index.js',

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build')
  },

  module: {
    rules: [{
      test: /\.css$/,
      exclude: /node_modules/,
      use: ExtractTextPlugin.extract({
        loader: 'css-loader'
      })
    }]
  },

  plugins: [
    new ExtractTextPlugin('bundle.css')
  ]
};
