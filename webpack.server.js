tsconfig.jsonconst fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const serverDirectories = [
  path.resolve('./src/server/'),
  path.resolve('./lib/server'),
  path.resolve('./lib/common')
];

const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(x => ['.bin'].indexOf(x) === -1)
  .forEach(mod => nodeModules[mod] = `commonjs ${mod}`);

const config = {
  devtool: 'source-map',
  entry: './src/server/index.ts',
  target: 'node',
  output: {
    path: path.resolve('./dist/server'),
    filename: 'index.js'
  },
  externals: nodeModules,
  module: {
    loaders: [{
      test: /\.ts$/,
      include: serverDirectories,
      loader: 'ts-loader'
    }]
  },
  resolve: {
    root: path.resolve(__dirname),
    extensions: ['', '.ts', '.js']
  }
};

if (process.env.NODE_ENV === 'production') {
  config.plugins = [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ];
}

module.exports = config;
