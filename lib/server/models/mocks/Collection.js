const { dbName } = require('lib/server/db');
const { Collection, User, View } = require('../');
const { ObjectId } = require('lib/server/utils/types');

class MockCollection {
  constructor(defaults = {}) {
    const user = new User({ username: 'test_user' });
    const view = new View();

    if (defaults.name && !defaults._collection) {
      const prefix = user.username;
      const suffix = defaults.name
        .replace(/\s/g, '')
        .toLowerCase();

      defaults._collection = `${prefix}_${suffix}`;
    }

    const collectionWithDefaults = _.defaultsDeep({}, defaults, {
      name: 'Documents',
      _db: `${dbName}_collections`,
      _collection: 'documents',
      fields: [
        {
          name: 'Boolean Field',
          type: 'BOOLEAN',
          renderMethod: 'PLAIN_TEXT',
          required: false,
          isArray: false
        },
        {
          name: 'String Field',
          type: 'STRING',
          renderMethod: 'PLAIN_TEXT',
          required: false,
          isArray: false
        },
        {
          name: 'Number Field',
          type: 'NUMBER',
          renderMethod: 'PLAIN_TEXT',
          required: false,
          isArray: false
        },
        {
          name: 'Date Field',
          type: 'DATETIME',
          renderMethod: 'PLAIN_TEXT',
          required: false,
          isArray: false
        },
        {
          name: 'Rating Field',
          type: 'NUMBER',
          renderMethod: 'RATING',
          required: false,
          isArray: false
        }
      ],
      creator: user._id,
      description: 'A mock collection for MongoDB documents',
      public: false,
      icon: 'document',
      defaultView: view._id,
      views: [view._id]
    });

    const collection = new Collection(collectionWithDefaults).toObject();

    if (!defaults.fields) {
      collection.fields.push({
        name: 'Collection Ref',
        type: 'COLLECTION',
        _collection: collection._id,
        view: collection.defaultView,
        required: false,
        isArray: false
      });
    }

    return collection;
  }
}

module.exports = MockCollection;
