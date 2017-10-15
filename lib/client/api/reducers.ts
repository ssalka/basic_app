import { routerReducer } from 'react-router-redux';
import { collectionReducer } from './collections';
import { documentReducer } from './documents';
import { userReducer } from './user';

export default {
  collection: collectionReducer,
  document: documentReducer,
  router: routerReducer,
  user: userReducer
};
