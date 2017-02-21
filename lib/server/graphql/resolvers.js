const { User, Collection, Session, View } = require('../models');
const _ = require('lodash');
const { ModelGen } = require('../utils');

const Queries = {
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

const Mutations = {
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
      injectCollectionQueries,
      _.cloneDeep(Queries)
    ),
    Mutation: collections.reduce(
      injectCollectionMutations,
      _.cloneDeep(Mutations)
    ),
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

function injectCollectionMutations(mutations, collection) {
  const { _collection } = collection;

  return _.assign(mutations, {
    [`upsert_${_collection}`]: (root, newDocument) => {
      const Model = ModelGen.getOrGenerateModel(collection);
      return Model.findById(newDocument._id).then(document => {
        if (!document) {
          return Model.create(newDocument);
        }

        // TODO: diffing algorithm, tests
        _.assign(document, newDocument);

        return document.save()
          .then(() => document)
          .catch(logger.error);
      });
    }
  });
}

function injectCollectionQueries(queries, collection) {
  const { _collection } = collection;

  return _.assign(queries, {
    [_collection]: (root, params = { ids: [], limit: 0 }) => {
      const Model = ModelGen.getOrGenerateModel(collection);
      const query = Model.find(getQuery(params));

      if (params.limit) {
        query.limit(params.limit);
      }

      return query.exec();
    },
    [`more_${_collection}`]: (root, params = { cursor: '' }) => {
      const Model = ModelGen.getOrGenerateModel(collection);

      // TODO: handle items per page, utilize cursor to fetch the right documents
      return Model.find({}).limit(50).exec().then(docs => ({
        cursor: '',
        [_collection]: docs
      }));
    }
  });
}

function getQuery(params) {
  const { ids } = params;
  return _(params)
    .omit(['ids', 'limit'])
    .assign({ _id: ids.length && { $in: ids } })
    .omitBy(_.isEmpty)
    .value();
}
