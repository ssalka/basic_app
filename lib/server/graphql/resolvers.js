const { User, Collection, Session, View } = require('../models');
const _ = require('lodash');
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

  upsertCollection(root, collection, context) {
    if (collection._id) {
      // collection already exists
      return Collection.upsert(collection);
    }

    delete collection._id; // defaults to null - mongoose doesn't like that :(
    _.defaults(collection, {
      creator: context.user._id,
      _db: 'user_collections',
      _collection: `${context.user.username}_${collection.name}`
        .toLowerCase()
        .replace(/\s/g, '')
    });

    const view = {
      name: collection.name,
      type: 'TABLE',
      creator: context.user._id
    };

    return Collection.createWithView(collection, view);
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
  const { _collection } = collection;

  return _.extend(queries, {
    [_collection]: (root, params = { ids: [], limit: 100 }) => {
      const Model = ModelGen.getOrGenerateModel(collection);
      const query = getQuery(params);
      return Model.find(query).limit(params.limit).exec();
    }
  });
}

function getQuery(params) {
  const { ids } = params;
  const query = {};
  if (ids.length) query._id = { $in: ids };
  return _.extend(query, _.omit(params, ['ids', 'limit']));
}
