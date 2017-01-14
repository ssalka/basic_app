const _ = require('lodash');
const { FIELD_TYPES } = require('lib/common/constants');

module.exports = queries => `
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

    ${queries.join('\n')}
  }

  type Mutation {
    authenticate(
      token: String!
    ): User

    addCollection(
      name: String,
      fields: [FieldInput],
      description: String
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
    _db: String
    _collection: String
    fields: [Field]
    description: String
    defaultView: View
    views: [View]
  }

  type View {
    _id: ID!
    name: String!
    type: ViewTypes!
    collections: [Collection]
    creator: User!
    description: String
    public: Boolean!
  }

  enum ViewTypes {
    DESKTOP
    DASHBOARD
    GRAPH
    TABLE
  }

  type Field {
    name: String
    type: FieldTypes
    required: Boolean
    isArray: Boolean
  }

  enum FieldTypes {
    ${_.map(FIELD_TYPES, 'key').join('\n')}
  }

  input FieldInput {
    name: String
    type: FieldTypes
    required: Boolean
    isArray: Boolean
  }
`;
