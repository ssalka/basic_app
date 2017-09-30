const _ = require('lodash');

module.exports = `
  type Mutation {
    authenticate(
      token: String!
    ): User

    upsertCollection(
      _id: ID,
      name: String!,
      fields: [FieldInput!]!,
      description: String,
      icon: String
    ): Collection
  }
`;
