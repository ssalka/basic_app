const _ = require('lodash');

module.exports = mutations => `
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

    ${_.uniqWith(mutations, _.invoke('trim')).join('\n')}
  }
`;
