const graphqlHTTP = require('express-graphql');
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
  }
`);

const queries = {
  me: () => User.findOne({ _id: "581f60e5a3193e23932cd6eb" }),
  user: ({id}) => User.findById(id).populate('library.collections').exec(),
  users: ({ids, limit = 0}) => {
    const query = {};
    if (_.isArray(ids)) query._id = { $in: ids };
    return User.find(query).populate('library.collections').limit(limit).exec()
  },
  collections: ({id}) => Collection.find({ _id: id }).exec()
};

module.exports = {
  listen: () => graphqlHTTP({
    schema,
    rootValue: queries,
    graphiql: true
  })
};
