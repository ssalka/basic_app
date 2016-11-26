const { buildSchema } = require('graphql');
const _ = require('lodash');
const { User, Collection } = require('lib/server/models');

const schema = buildSchema(`
  type Query {
    user(
      id: ID,
      username: String,
      email: String
    ): User

    users(
      ids: [ID!],
      limit: Int
    ): [User]

    collections(
      ids: [ID!],
      creator: String,
      limit: Int
    ): [Collection]
  }

  # A user on the site
  type User {
    _id: ID!
    username: String!
    email: String
    createdAt: String
    library: Library
  }

  # A user's content
  type Library {
    collections: [Collection]
  }

  # A collection of documents owned by a user
  type Collection {
    _id: ID!
    name: String
    creator: User
    icon: String
    path: String
  }
`);

const queries = {
  user: ({id, email, username}) => {
    let query;

    if (id) {
      query = User.findById(id);
    }
    else if (username) {
      query = User.findOne({ username });
    }
    else if (email) {
      query = User.findOne({ email });
    }
    else {
      query = User.find();
    }

    return query.populate('library.collections').exec();
  },
  users: ({ids = [], limit = 0}) => {
    const query = {};

    if (ids.length) {
      query._id = { $in: ids };
    }

    return User.find(query).populate('library.collections').limit(limit).exec();
  },
  collections: ({ids = [], creator, limit = 0}) => {
    const query = {};

    if (creator) {
      query.creator = creator;
    }

    if (ids.length) {
      query._id = { $in: ids };
    }

    return Collection.find(query).populate('creator').limit(limit).exec();
  }
};

module.exports = { schema, queries };
