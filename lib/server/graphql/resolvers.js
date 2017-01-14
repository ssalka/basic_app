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
  // Find a collection document, then use it to get the actual collection's documents
  getCollection(root, {id, limit = 0}) {
    if (!id) throw new Error('A valid ObjectId must be given as a parameter');
    return Collection.findById(id).populate({ path: 'creator', model: User })
      .then(collection => {
        const Model = ModelGen.getOrGenerateModel(collection);
        return Model.find().limit(limit).exec().then(encodeDocuments);
      });

    function encodeDocuments(docs) {
      // HACK: stringify documents until schemas can be mapped to GraphQL
      return docs.map(JSON.stringify).map(body => ({ body }));
    }
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
  const { name, fields, creator, _collection } = collection;
  return _.extend(queries, {
    [`${creator.username}_${_collection}`]: (root, {ids, limit = 100} = {}, context) => {
      const Model = ModelGen.getOrGenerateModel(collection);
      const query = {};
      if (ids) query._id = { $in: ids };
      return Model.find(query).limit(limit).exec();
    }
  });
}
