const _ = require('lodash');
const { User } = require('../');
const { ObjectId } = require('lib/server/utils/types');

module.exports = defaults => {
  const user = _.defaultsDeep(defaults, {
    _id: ObjectId(),
    username: 'test_user',
    email: 'test_email@gmail.com',
    name: {
      first: 'Steven',
      last: 'Salka'
    },
    salt: 'abc123',
    hash: 'xyz456',
    library: {
      collections: [ObjectId()],
      views: []
    }
  });

  return new User(user);
};
