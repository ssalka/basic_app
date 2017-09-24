const _ = require('lodash');
const { collectionsDbName } = require('lib/server/db');
const { Collection, Session } = require('lib/server/models');
const { ModelGen } = require('lib/server/utils');
const { READONLY_FIELDS } = require('lib/common/constants');

const mutations = {
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
      _db: collectionsDbName,
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

module.exports = collections => collections.reduce(
  injectCollectionMutations,
  mutations
);

function injectCollectionMutations(mutations, collection) {
  const { _collection } = collection;

  return _.assign(mutations, {
    [`upsert_${_collection}`]: (root, newDocument) => {
      const Model = ModelGen.getOrGenerateModel(collection);
      return Model.findById(newDocument._id).then(document => {
        if (!document) {
          return Model.create(newDocument);
        }

        // undefined values come out of GraphQL as null
        // don't want to set these on documents
        const denullify = val => _.isArray(val)
          ? _.reject(val, _.isNull)
          : _.isNull(val) ? undefined : val;


        // TODO: diffing algorithm
        const updates = _(newDocument)
          .omit(READONLY_FIELDS)
          .mapValues(denullify)
          .value();

        _.assign(document, updates);

        return new Promise((resolve, reject) => document.save(
          (err, doc) => err ? reject(err) : resolve(doc)
        ));
      });
    }
  });
}
