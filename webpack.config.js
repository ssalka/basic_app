const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
  devtool: 'source-map',
  entry: ['./src/client/index.js'],
  output: {
    path: path.resolve('./dist'),
    filename: 'client.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      include: [
        path.resolve('./src/client'),
        path.resolve('./lib')
      ],
      loader: 'babel'
    }, {
      test: /\.(less|css)$/,
      loaders: ["style", "css", "less"]
    }, {
      test: /\.(json)$/,
      loader: 'json'
    }]
  },
  resolve: {
    root: path.resolve(__dirname)
  },
  plugins: [
    new webpack.DefinePlugin({
      // So react doesn't complain about being minified
      'process.env': { 'NODE_ENV': '"production"' }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      { from: 'src/client/index.html' }
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
