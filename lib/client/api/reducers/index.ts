import { routerReducer } from 'react-router-redux';
import userReducer from './userReducer';

export default {
  router: routerReducer,
  user: userReducer
};
