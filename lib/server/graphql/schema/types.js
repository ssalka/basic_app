const _ = require('lodash');
const { FIELD_TYPES, RENDER_METHODS } = require('lib/common/constants');
const { getGraphQLCollectionType } = require('lib/common/graphql');

module.exports = models => `
  scalar Date

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
    slug: String
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
    renderMethod: RenderMethodTypes
  }

  input FieldInput {
    name: String
    type: FieldTypes
    required: Boolean
    isArray: Boolean
    renderMethod: RenderMethodTypes
  }

  enum FieldTypes {
    ${_.map(FIELD_TYPES.STANDARD, 'key').join('\n')}
    ${_.map(models, getGraphQLCollectionType).join('\n')}
  }

  enum RenderMethodTypes {
    ${_.map(RENDER_METHODS, 'key').join('\n')}
  }
`;
