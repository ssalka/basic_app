const { User, Collection } = require('../models');
const _ = require('lodash');

const Query = {
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

module.exports = {
  Query,
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
