const { buildSchema } = require('graphql');
const _ = require('lodash');
const { User, Collection } = require('lib/server/models');

const schema = buildSchema(`
  type Query {
    me: User
    hello: String
    user(id: String): User
    users(limit: Int): [User]
    collections(id: String, creator: String): [Collection]
  }

  type User {
    # A user on the site
    _id: String
    username: String
    email: String
    createdAt: String
    library: Library
  }

  type Library {
    # A user's content
    collections: [Collection]
  }

  type Collection {
    # A collection of documents owned by a user
    _id: String
    name: String
    creator: User
    icon: String
  }
`);

const queries = {
  me: () => User.findOne({ _id: "581f60e5a3193e23932cd6eb" }),
  user: ({id}) => User.findById(id).populate('library.collections').exec(),
  users: ({ids, limit = 0}) => {
    const query = {};
    if (_.isArray(ids)) query._id = { $in: ids };
    return User.find(query).populate('library.collections').limit(limit).exec();
  },
  collections: ({ids}) => {
    const query = {};
    if (_.isArray(ids)) query._id = { $in: ids };
    return Collection.find(query).populate('creator').exec();
  }
};

module.exports = { schema, queries };
