const _ = require('lodash');
const { dbName } = require('lib/server/db');
const { ObjectId } = require('lib/server/utils/types');
const MockUser = require('./User');

const user = new MockUser();

module.exports = defaults => {
  return _.defaultsDeep(defaults, {
    _id: user.library.collections[0],
    name: 'Documents',
    _db: '${dbName}_collections',
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
