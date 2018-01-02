import * as React from 'react';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import store, { browserHistory } from 'lib/client/api/store';
import AppRouter from './router';

render(
  <Provider store={store}>
    <ConnectedRouter history={browserHistory}>
      <DragDropContextProvider backend={HTML5Backend}>
        <AppRouter />
      </DragDropContextProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
