const { User, Collection, Session, View } = require('../models');
const _ = require('lodash');
const async = require('async');
const { ModelGen } = require('../utils');

const Query = {
  me(root, args, context) {
    const userId = _.get(context, 'user._id');
    return userId ? User.findById(userId) : null;
  },
  user(root, query = {}) {
    query.limit = 1;
    return User.search(query).exec();
  },
  users(root, query = {}) {
    return User.search(query).exec();
  },
  collections(root, query = {}) {
    return Collection.search(query).exec();
  }
};

const Mutation = {
  authenticate(root, {token}) {
    return Session.findByToken(token)
      .populate('user')
      .then(session => session.user)
      .catch(console.error);
  },

  addCollection(root, collection, context) {
    _.defaults(collection, _.pickBy({
      creator: context.user._id,
      _db: context.user.username,
      _collection: collection.name
        .toLowerCase()
        .replace(/\s/g, '')
    }));

    const view = {
      name: collection.name,
      type: 'TABLE',
      creator: context.user._id
    };

    const collectionPromise = new Promise((resolve, reject) => {
      async.waterfall([
        // Create the collection
        cb => Collection.create(collection, cb),
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

    return collectionPromise;
  }
};

module.exports = function getResolvers(collections) {
  return {
    Query: collections.reduce(
      injectCollectionResolver,
      _.cloneDeep(Query)
    ),
    Mutation,
    User: {
      library(user) {
        return {
          collections: Collection.findByCreator(user).exec()
        };
      }
    },
    Collection: {
      creator(collection) {
        return User.findById(collection.creator).exec();
      },
      defaultView(collection) {
        return View.findById(collection.defaultView).exec();
      },
      views(collection) {
        return View.findByCollection(collection).exec();
      }
    }
  };
};

function injectCollectionResolver(queries, collection) {
  const { fields, creator, _collection } = collection;
  return _.extend(queries, {
    [`${creator.username}_${_collection}`]: (root, params = {}) => {
      const { ids = [], limit = 100 } = params;
      const Model = ModelGen.getOrGenerateModel(collection);

      const baseQuery = ids.length ? { _id: { $in: ids } } : {};
      const collectionQuery = fields.reduce(setQueryParam(params), baseQuery);

      return Model.find(collectionQuery).limit(limit).exec();
    }
  });
}

function setQueryParam(params) {
  return (query, field) => {
    const fieldName = _.camelCase(field.name);
    return _.has(params, fieldName) ? _.extend(query, {
      [fieldName]: params[fieldName]
    }) : query;
  }
}
