import * as _ from 'lodash';
import { User, Collection } from '../';

export default class MockUser {
  constructor(user = {}) {
    const collection = new Collection();

    const userWithDefaults = _.defaultsDeep({}, user, {
      username: 'test_user',
      email: 'test_email@gmail.com',
      name: {
        first: 'Steven',
        last: 'Salka'
      },
      salt: 'abc123',
      hash: 'xyz456',
      library: {
        collections: [collection._id],
        views: []
      }
    });

    return new User(userWithDefaults).toObject();
  }
}
