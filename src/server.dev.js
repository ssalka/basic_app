const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('webpack.config');

config.entry.unshift('webpack-dev-server/client?http://localhost:8080/', 'webpack/hot/dev-server');

// Start WDS for client-side hot reloading
new WebpackDevServer(webpack(config), {
  hot: true,
  historyApiFallback: true,
  stats: 'errors-only',
  proxy: {
    '*': 'http://localhost:3000'
  }
}).listen(8080, 'localhost', err => {
  console.log(err || 'webpack dev server listening on port 8080');
});

// Start the actual server
require('./server');
