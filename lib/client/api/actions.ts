import { collectionActions } from './collections';
import { documentActions } from './documents';
import { userActions } from './user';
import { valueActions } from './values';

export * from './collections/actions';
export * from './documents/actions';
export * from './user/actions';
export * from './values/actions';

export default {
  ...collectionActions,
  ...documentActions,
  ...userActions,
  ...valueActions
};
