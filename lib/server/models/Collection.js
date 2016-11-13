const { ModelGen, types: { ref, Mixed } } = require('../utils');

const CollectionSchema = {
  name: {
    // verbose name
    type: String,
    required: true
  },
  _db: {
    // where collection is stored
    type: String,
    required: true,
    default: 'test'
  },
  _collection: {
    // name in db
    type: String,
    required: true
  },
  _schema: Mixed,

  // Metadata
  creator: ref('User', true),
  description: String,
  public: {
    type: Boolean,
    required: true,
    default: false
  },
};

const Collection = ModelGen.generateModel(
  'Collection', CollectionSchema
);

module.exports = Collection;
