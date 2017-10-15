import { collectionActions } from './collections';
import { userActions } from './user';

export * from './collections/actions';
export * from './user/actions';

export default {
  ...collectionActions,
  ...userActions
};
