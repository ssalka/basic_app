import * as webpack from 'webpack';
import * as WebpackDevServer from 'webpack-dev-server';
import config from 'webpack.config';

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
import './server';
