var path = require('path');
var webpack = require('webpack');
var node_modules = path.resolve(__dirname, '../node_modules');

var dir_client = path.resolve(__dirname, './app');
var dir_dist = path.resolve(__dirname, './dist');

module.exports = {
  entry: [
    'react-hot-loader/patch',
    path.resolve(dir_client, 'index.js')
  ],
  output: {
    path: dir_dist, // for standalone building
    publicPath: '/assets/', // for hot building
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader',
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader?modules',
          'postcss-loader',
        ],
        include: path.resolve(__dirname, 'app')
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ],
        include: [/node_modules/, /styles/]
      }
    ],
  },
  plugins: [
    // Avoid publishing files when compilation fails
    new webpack.NoEmitOnErrorsPlugin()
  ],
  stats: {
    colors: true // Nice colored output
  },
  // Create Sourcemaps for the bundle
  devtool: 'source-map'
};