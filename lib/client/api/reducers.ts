import { AnyAction } from 'redux';
import { routerReducer } from 'react-router-redux';
import { collectionReducer } from './collections';
import { documentReducer } from './documents';
import { userReducer } from './user';
import { valueReducer } from './values';

export default {
  collection: collectionReducer,
  documents: documentReducer,
  router: routerReducer,
  user: userReducer,
  value: valueReducer,
  actionHistory(state: AnyAction[] = [], action: AnyAction): AnyAction[] {
    return [action, ...state];
  }
};
