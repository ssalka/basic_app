import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import store, { browserHistory } from 'lib/client/api/store';
import AppRouter from './router';

render(
  <Provider store={store}>
    <ConnectedRouter history={browserHistory}>
      <AppRouter />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
