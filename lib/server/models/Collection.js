const _ = require('lodash');
const { ModelGen, types: { ref, Mixed } } = require('../utils');
const { FIELD_TYPES } = require('lib/common');

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
  fields: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: FIELD_TYPES
    },
    required: Boolean,
    isArray: Boolean
  }],

  // Metadata
  creator: ref('User', true),
  description: String,
  public: {
    type: Boolean,
    required: true,
    default: false
  },
  icon: String,
  defaultView: ref('View'),
  views: [ref('View')]
};

const virtuals = {
  path: {
    getter() {
      return `/${_.kebabCase(this.name)}`;
    }
  }
};

const statics = {
  findByCreator({ _id }) {
    return this.find({ creator: _id });
  },
  search({ ids, creator, limit = 0 }) {
    const query = {};
    if (creator) query.creator = creator;
    if (ids) query._id = { $in: ids };
    return this.find(query).limit(limit);
  }
};

const Collection = ModelGen.generateModel(
  'Collection', CollectionSchema, {
    props: { virtuals, statics }
  }
);

module.exports = Collection;
