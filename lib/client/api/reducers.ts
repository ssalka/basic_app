import { routerReducer } from 'react-router-redux';
import { userReducer } from './user';

export default {
  router: routerReducer,
  user: userReducer
};
