const path = require('path');
const webpack = require('webpack');

const config = {
  devtool: 'source-map',
  output: {
    path: './src/public',
    filename: 'all.min.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      include: path.resolve('./src/client'),
      loader: 'babel'
    }]
  },
  resolve: {
    root: [path.resolve('./node_modules')]
  },
  externals: {
    // Use cached libraries to avoid rebundling
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  plugins: [
    new webpack.DefinePlugin({
      // So react doesn't complain about being minified
      'process.env': { 'NODE_ENV': '"production"' }
    })
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
