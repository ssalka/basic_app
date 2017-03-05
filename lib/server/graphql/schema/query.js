const _ = require('lodash');

module.exports = queries => `
  type Query {
    me: User
    user(
      _id: ID,
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

    ${_.uniqWith(queries, _.invoke('trim')).join('\n')}
  }
`;
