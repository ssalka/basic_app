import createHistory from 'history/createBrowserHistory';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import {
  bindActionCreators,
  createStore,
  combineReducers,
  applyMiddleware
} from 'redux';
import { connect as reduxConnect } from 'react-redux';
import { push } from 'react-router-redux';

export const browserHistory = createHistory();

export default createStore(
  combineReducers({
    router: routerReducer
  }),
  applyMiddleware(routerMiddleware(browserHistory))
);

export const connect = reduxConnect(
  state => ({ store: state }),
  dispatch => ({
    actions: bindActionCreators(
      {
        changePage: () => push('/collections')
      },
      dispatch
    )
  })
);
