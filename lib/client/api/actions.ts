import { collectionActions } from './collections';
import { documentActions } from './documents';
import { entityActions } from './entities';
import { userActions } from './user';

export * from './collections/actions';
export * from './documents/actions';
export * from './entities/actions';
export * from './user/actions';

export default {
  ...collectionActions,
  ...documentActions,
  ...userActions,
  ...entityActions
};
