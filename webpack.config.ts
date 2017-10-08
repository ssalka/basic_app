import * as path from 'path';
import * as webpack from 'webpack';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';

const clientDirectories = [
  path.resolve('./lib/client'),
  path.resolve('./lib/common'),
  path.resolve('./src/client')
];

const config = {
  devtool: 'source-map',
  entry: ['./src/client/index.tsx'],
  output: {
    path: path.resolve('./dist'),
    filename: 'client.js'
  },
  module: {
    preLoaders: [{
      test: /\.tsx?$/,
      include: clientDirectories,
      loader: 'tslint-loader'
    }],
    loaders: [{
      test: /\.tsx?$/,
      include: clientDirectories,
      loader: 'ts-loader?configFileName=tsconfig.client.json'
    }, {
      test: /\.(less|css)$/,
      loaders: ["style", "css", "less"]
    }, {
      test: /\.json$/,
      loader: 'json'
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
  ],
  tslint: {
    formatter: 'stylish',
    configFile: 'tslint.json'
  }
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  );
}
else if (process.env.NODE_ENV === 'development') {
  config.entry.unshift(
    'webpack-dev-server/client?http://localhost:8080/',
    'webpack/hot/dev-server'
  );
}

export default config;
