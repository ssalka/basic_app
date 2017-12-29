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
  console.log(err || '[WDS] Running locally at: http://localhost:8080\n');
});
