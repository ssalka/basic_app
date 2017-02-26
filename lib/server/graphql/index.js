const _ = require('lodash');
const getSchema = require('./schema');
const getResolvers = require('./resolvers');
const { Collection } = require('../models');
const { makeExecutableSchema } = require('graphql-tools');
const { getGraphQLField } = require('lib/common/graphql');

// Load collections on app start to inject into GraphQL
let models = [];
Collection.find().exec()
  .then(docs => models = docs)
  .catch(console.error);

module.exports = function getGraphQLSchema({
  query = '',
  variables: { _id, fields } = {}
}) {
  if (query.includes('upsertCollection') && _id) {
    // TODO: migrate collection's docs if necessary (eg field name changed)
    const modelIndex = _.findIndex(models, { id: _id });
    modelIndex >= 0 && _.assign(models[modelIndex], { fields });
  }

  const queries = models.map(getGraphQLQuerySignature);
  const mutations = models.map(getGraphQLMutationSignature)
  const typeDefs = models.reduce(modelInjector, getSchema(queries, mutations));
  const resolvers = getResolvers(models);
  return makeExecutableSchema({ typeDefs, resolvers });
};

function getGraphQLQuerySignature({ _collection, description, fields }) {
  const mutationArgs = fields.map(getGraphQLField).join(',\n');

  return `
    ${description && '#'} ${description}
    ${_collection}(
      ids: [ID!],
      limit: Int,
      ${mutationArgs}
    ): [${_collection}]

    more_${_collection}(
      cursor: ID
    ): ${_collection}Cursor
  `;
}

function getGraphQLMutationSignature({ _collection, fields }) {
  const mutationArgs = fields.map(getGraphQLField).join(',\n');

  return `
    upsert_${_collection}(
      _id: ID,
      ${mutationArgs}
    ): ${_collection}
  `;
}

function modelInjector(schema, model) {
  const fields = model.fields.map(getGraphQLField).join('\n');
  const type = getGraphQLTypeName(model.name);

  return schema.concat(`
    type ${type} {
      _id: ID!
      ${fields}
    }

    type ${type}Cursor {
      cursor: ID
      ${type}: [${type}]
    }
  `);
}

function getGraphQLTypeName(modelName) {
  return _.find(models, { name: modelName })._collection;
}
