import { AnyAction } from 'redux';
import { routerReducer } from 'react-router-redux';
import { collectionReducer } from './collections';
import { documentReducer } from './documents';
import { entityReducer } from './entities';
import { userReducer } from './user';

export default {
  collection: collectionReducer,
  documents: documentReducer,
  entity: entityReducer,
  router: routerReducer,
  user: userReducer,
  actionHistory(state: AnyAction[] = [], action: AnyAction): AnyAction[] {
    return [action, ...state];
  }
};
