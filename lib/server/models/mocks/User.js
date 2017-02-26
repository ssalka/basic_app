const _ = require('lodash');
const { User, Collection } = require('../');
const { ObjectId } = require('mongoose').Schema.Types;

class MockUser {
  constructor(user) {
    const collection = new Collection;

    return _.defaultsDeep(user, {
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
  }
}

module.exports = MockUser;
