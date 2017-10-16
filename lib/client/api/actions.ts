import { collectionActions } from './collections';
import { documentActions } from './documents';
import { userActions } from './user';

export * from './collections/actions';
export * from './documents/actions';
export * from './user/actions';

export default {
  ...collectionActions,
  ...documentActions,
  ...userActions
};
