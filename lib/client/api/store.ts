import createHistory from 'history/createBrowserHistory';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { bindActionCreators, createStore, combineReducers, applyMiddleware } from 'redux';
import { connect as reduxConnect } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import actions from './actions';
import reducers from './reducers';
import rootSaga from './sagas';

export const browserHistory = createHistory();

const sagaMiddleware = createSagaMiddleware();

export default createStore(
  combineReducers(reducers),
  applyMiddleware(routerMiddleware(browserHistory), sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

export const connect = reduxConnect(
  state => ({ store: state }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  })
);
