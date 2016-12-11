const { User, Collection, Session } = require('../models');
const _ = require('lodash');

const Query = {
  me(root, args, context) {
    const userId = _.get(context, 'user._id');
    return userId ? User.findById(userId) : null;
  },
  user(root, {id, email, username} = {}) {
    let query;

    if (id) {
      // Find by ID
      query = User.findById(id);
    }
    else if (username || email) {
      // OR search on other fields
      const params = _.pickBy({ username, email });
      query = User.findOne({
        $or: _.map(params, (val, key) => ({ [key]: val }))
      });
    }
    else {
      return null;
    }

    return query.exec();
  },
  users(root, {ids = [], limit = 0} = {}) {
    const query = {};

    if (ids.length) {
      query._id = { $in: ids };
    }

    return User.find(query).limit(limit).exec();
  },
  collections(root, {ids = [], creator, limit = 0} = {}) {
    const query = {};

    if (creator) {
      query.creator = creator;
    }

    if (ids.length) {
      query._id = { $in: ids };
    }

    return Collection.find(query).limit(limit).exec();
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
      name: 'Things',
      icon: 'blank',
      creator: context.user._id,
      _db: context.user.username,
      _collection: collection.name
        .toLowerCase()
        .replace(/\s/g, '')
    }));

    return Collection.create(collection)
      .then(coll => {
        User.findById(coll.creator)
          .then(user => {
            // Add the collection to the creator's library
            user.library.collections.push(coll);
            user.save();
          })
          .catch(console.error);
        return coll;
      })
      .catch(console.error);
  }
};

module.exports = {
  Query, Mutation,
  User: {
    library(user) {
      return {
        collections: Collection.find({ creator: user._id }).exec()
      };
    }
  },
  Collection: {
    creator(collection) {
      return User.findById(collection.creator).exec();
    }
  }
}
