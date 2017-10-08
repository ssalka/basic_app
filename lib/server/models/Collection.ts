import * as _ from 'lodash';
import * as async from 'async';
import User from './User';
import View from './View';
import { ModelGen, types } from '../utils';
import { FIELD_TYPES, RENDER_METHODS, VIEW_TYPES } from 'lib/common/constants';

const { ref, Mixed } = types;

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
    _collection: ref('Collection'),
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
        pascalCase: _.startCase(this.name).replace(/\s/g, '')
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
    const query: any = {};
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

export default Collection;