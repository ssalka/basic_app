const _ = require('lodash');

module.exports = `
  type Query {
    user(
      _id: ID,
      username: String,
      email: String,
      self: Boolean
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
`;
