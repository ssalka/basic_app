import * as _ from 'lodash';
import * as path from 'path';
import * as webpack from 'webpack';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';

const clientDirectories = [
  path.resolve('./lib/client'),
  path.resolve('./lib/common'),
  path.resolve('./src/client')
];

const ROOT = path.resolve(__dirname);
const DIST = path.resolve('./dist');

const config = {
  devtool: 'source-map',
  context: ROOT,
  entry: ['./src/client/index.tsx'],
  output: {
    path: DIST,
    filename: 'client.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: clientDirectories,
        enforce: 'pre',
        loader: 'tslint-loader',
        options: {
          formatter: 'stylish',
          configFile: 'config/tslint.json'
        }
      },
      {
        test: /\.tsx?$/,
        include: clientDirectories,
        use: 'ts-loader?configFileName=config/tsconfig.client.json'
      },
      {
        test: /\.(less|css)$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }
    ]
  },
  resolve: {
    alias: {
      lib: path.resolve('./lib'),
      src: path.resolve('./src')
    },
    modules: ['node_modules'],
    extensions: ['.js', '.ts', '.tsx']
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: !['production', 'test'].includes(process.env.NODE_ENV)
    }),
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
} else if (process.env.NODE_ENV !== 'test') {
  config.entry.unshift(
    'webpack-dev-server/client?http://localhost:8080/',
    'webpack/hot/dev-server'
  );

  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      loginCredentials: _.mapValues(
        {
          username: process.env.DEV_LOGIN_USERNAME,
          password: process.env.DEV_LOGIN_PASSWORD
        },
        JSON.stringify
      )
    })
  );
}

export default config;
