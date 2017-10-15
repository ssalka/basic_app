import { routerReducer } from 'react-router-redux';
import { collectionReducer } from './collections';
import { userReducer } from './user';

export default {
  collection: collectionReducer,
  router: routerReducer,
  user: userReducer
};
