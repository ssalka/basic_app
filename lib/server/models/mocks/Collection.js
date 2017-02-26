const { dbName } = require('lib/server/db');
const { Collection, User, View } = require('../');


module.exports = class MockCollection {
  constructor(collection = {}) {
    const user = new User;
    const view = new View;

    if (collection && collection.name && !collection._collection) {
      const prefix = 'testUser';
      const suffix = collection.name
        .replace(/\s/g, '')
        .toLowerCase();

      collection._collection = `${prefix}_${suffix}`;
    }

    return _.defaultsDeep(collection, {
      name: 'Documents',
      _db: `${dbName}_collections`,
      _collection: 'documents',
      fields: [
        { name: 'Boolean Field', type: 'BOOLEAN', required: false, isArray: false },
        { name: 'String Field', type: 'STRING', required: false, isArray: false },
        { name: 'Number Field', type: 'NUMBER', required: false, isArray: false },
        { name: 'Mixed Field', type: 'MIXED', required: false, isArray: false },
      ],
      creator: user._id,
      description: 'A mock collection for MongoDB documents',
      public: false,
      icon: 'document',
      views: [view._id]
    });
  }
};
