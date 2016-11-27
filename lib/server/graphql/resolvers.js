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

const defaultCollection = {
  name: 'Things',
  _db: 'q',
  creator: '581f60e5a3193e23932cd6eb',
  icon: 'blank'
};

const Mutation = {
  addCollection(root, collection) {
    _.defaults(collection, defaultCollection, {
      _collection: collection.name.toLowerCase().replace(/\s/g, '')
    });

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
    },
    _schema(collection) {
      return {
        fields: ['Title', 'Other Field']
      };
    }
  }
}
