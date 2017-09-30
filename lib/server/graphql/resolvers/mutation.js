const _ = require('lodash');
const { collectionsDbName } = require('lib/server/db');
const { Collection, Session } = require('lib/server/models');

module.exports = {
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
