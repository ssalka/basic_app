const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');
const { FIELD_TYPES } = require('lib/common');

const schema = `
  type Query {
    me: User
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

  type Mutation {
    addCollection(
      name: String,
      _collection: String,
      _db: String,
      icon: String
    ): Collection
  }

  # A user on the site
  type User {
    _id: ID!
    username: String!
    email: String
    createdAt: String!
    library: Library!
  }

  # A user's content
  type Library {
    collections: [Collection]
  }

  # A collection of documents owned by a user
  type Collection {
    _id: ID!
    name: String!
    creator: User!
    icon: String
    path: String
    _db: String,
    _collection: String,
    fields: [Field]
  }

  type Field {
    name: String
    type: FieldTypes
  }

  enum FieldTypes {
    ${FIELD_TYPES}
  }
`;

module.exports = makeExecutableSchema({
  typeDefs: schema, resolvers
});
