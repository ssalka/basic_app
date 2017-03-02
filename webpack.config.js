const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const clientDirectories = [
  path.resolve('./src/client'),
  path.resolve('./lib')
];

const config = {
  devtool: 'source-map',
  entry: ['./src/client/index.tsx'],
  output: {
    path: path.resolve('./dist'),
    filename: 'client.js'
  },
  module: {
    loaders: [{
      test: /\.tsx?$/,
      include: clientDirectories,
      loader: 'ts-loader'
    }, {
      test: /\.js$/,
      include: clientDirectories,
      loader: 'babel'
    }, {
      test: /\.(less|css)$/,
      loaders: ["style", "css", "less"]
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.gql$/,
      loader: 'graphql-tag/loader'
    }]
  },
  resolve: {
    root: path.resolve(__dirname),
    extensions: ['', '.ts', '.tsx', '.js']
  },
  plugins: [
    new webpack.ProvidePlugin({
      _: 'lodash',
      React: 'react'
    }),
    new webpack.DefinePlugin({
      // So react doesn't complain about being minified
      'process.env': { 'NODE_ENV': '"production"' }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      { from: 'src/client/index.html' },
      { from: 'node_modules/@blueprintjs/core/dist/blueprint.css' },
      { from: 'node_modules/@blueprintjs/core/dist/blueprint.css.map' },
      { from: 'node_modules/@blueprintjs/core/resources', to: 'resources' }
    ])
  ]
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  );
}

module.exports = config;
