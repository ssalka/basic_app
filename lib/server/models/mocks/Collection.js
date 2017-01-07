const _ = require('lodash');
const MockUser = require('./User');
const { ObjectId } = require('lib/server/utils/types');

const user = new MockUser();

module.exports = defaults => {
  return _.defaultsDeep(defaults, {
    _id: user.library.collections[0],
    name: 'Documents',
    _db: 'user_collections',
    _collection: 'documents',
    fields: [
      { name: 'String Field', type: 'STRING' },
      { name: 'Number Field', type: 'NUMBER' },
      { name: 'Mixed Field', type: 'MIXED' },
      { name: 'Unknown Field', type: null }
    ],
    creator: user._id,
    description: 'A mock collection for MongoDB documents',
    public: false,
    icon: 'document',
    views: [ObjectId()]
  });
};
