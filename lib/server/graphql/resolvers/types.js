const { User, Collection, View } = require('lib/server/models');

module.exports = {
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
