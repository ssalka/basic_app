const { dbName } = require('lib/server/db');
const { Collection, User, View } = require('../');


module.exports = class MockCollection {
  constructor(defaults) {
    const user = new User;
    const view = new View;

    return _.defaultsDeep(defaults, {
      name: 'Documents',
      _db: `${dbName}_collections`,
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
      views: [view._id]
    });
  }
};
