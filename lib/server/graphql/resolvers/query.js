const _ = require('lodash');
const { User, Collection } = require('lib/server/models');
const { ModelGen } = require('lib/server/utils');

const queries = {
  user(root, query = {}, context) {
    if (query.self) {
      // auth query
      return context.user && User.findById(context.user._id).exec()
    }

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

module.exports = collections => collections.reduce(
  injectCollectionQueries,
  queries
);

function injectCollectionQueries(queries, collection) {
  const { _collection } = collection;

  return _.assign(queries, {
    [_collection]: (root, params = {}) => {
      const Model = ModelGen.getOrGenerateModel(collection);
      const query = Model.find(getQuery(params));

      if (_.isNumber(params.limit)) {
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
  const ids = _.get(params, 'ids', []);
  return _(params)
    .omit(['ids', 'limit'])
    .assign({ _id: ids.length && { $in: ids } })
    .omitBy(_.isEmpty)
    .value();
}
