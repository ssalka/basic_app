const _ = require('lodash');
const async = require('async');
const User = require('./User');
const View = require('./View');
const { ModelGen, types: { ref, Mixed } } = require('../utils');
const { FIELD_TYPES, RENDER_METHODS, VIEW_TYPES } = require('lib/common/constants');
const { getGraphQLCollectionType } = require('lib/common/graphql');

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
    required: true,
    index: true,
    unique: true
  },
  fields: [{
    _id: false,
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: _.map(FIELD_TYPES.STANDARD, 'key').concat(FIELD_TYPES.COLLECTION)
    },
    _collection: String,
    required: Boolean,
    isArray: Boolean,
    renderMethod: {
      type: String,
      enum: _.flatMap([RENDER_METHODS, VIEW_TYPES], 'key')
    },
    view: ref('View')
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
      return `/collections/${this.slug}`;
    }
  },
  slug: {
    getter() {
      return _.kebabCase(this.name);
    }
  },
  typeFormats: {
    getter() {
      return {
        graphql: getGraphQLCollectionType(this)
      };
    }
  }
};

const statics = {
  findByName(_collection) {
    return this.findOne({ _collection });
  },
  upsert({ _id, name, description, fields, icon }) {
    return this.findByIdAndUpdate(_id, {
      $set: { name, description, fields, icon }
    }, { new: true });
  },
  findByCreator({ _id }) {
    return this.find({ creator: _id });
  },
  search({ ids, creator, limit = 0 }) {
    const query = {};
    if (creator) query.creator = creator;
    if (ids) query._id = { $in: ids };
    return this.find(query).limit(limit);
  },
  createWithView(collection, view) {
    const Collection = this;
    return new Promise((resolve, reject) => {
      async.waterfall([
        // Create the collection
        cb => new Collection(collection).save(
          (err, coll) => cb(err, coll)
        ),
        // Create a view for the collection
        (coll, cb) => {
          view.collections = [coll._id];
          View.create(view, (err, _view) => cb(err, _view, coll));
        },
        // Save a reference to the view in the collection
        (view, coll, cb) => {
          coll.defaultView = view._id;
          coll.views = [view._id];
          coll.save((err, _coll) => cb(err, _coll));
        },
        // Find the collection's creator
        (coll, cb) => User.findById(coll.creator,
          (err, user) => cb(err, user, coll)
        ),
        // Add the collection to the creator's library
        (user, coll, cb) => {
          user.library.collections.push(coll);
          user.save(err => cb(err, coll));
        }
      ], (err, coll) => err ? reject(err) : resolve(coll));
    });
  }
};

const Collection = ModelGen.generateModel(
  'Collection', CollectionSchema, {
    props: { virtuals, statics }
  }
);

module.exports = Collection;
