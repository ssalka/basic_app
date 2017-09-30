const { User, Collection } = require('lib/server/models');

module.exports = {
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
