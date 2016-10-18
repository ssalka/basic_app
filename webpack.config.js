const path = require('path');
const webpack = require('webpack');

module.exports = {
  output: {
    path: path.join(__dirname, 'src/public'),
    filename: 'all.min.js'
  },
  module: {
    loaders: [{
      test: /\.js/,
      include: path.join(__dirname, 'src/client'),
      loader: 'babel-loader'
    }]
  },
  resolve: {
    root: [path.resolve('./client')]
  },
  externals: {
    // Use cached libraries to avoid rebundling
    "react": "React",
    "react-dom": "ReactDOM"
  },
  plugins: [
    new webpack.DefinePlugin({
      // So react doesn't complain about being minified
      'process.env': { 'NODE_ENV': '"production"' }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ]
};
