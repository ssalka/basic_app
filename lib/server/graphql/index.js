const _ = require('lodash');
const getSchema = require('./schema');
const getResolvers = require('./resolvers');
const { Collection } = require('../models');
const { makeExecutableSchema } = require('graphql-tools');

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
  const typeDefs = models.reduce(modelInjector, getSchema(queries));
  const resolvers = getResolvers(models);
  return makeExecutableSchema({ typeDefs, resolvers });
};

function getGraphQLQuerySignature({ name, fields, description, _collection }) {
  const query = {
    name: _collection,
    args: fields.map(getGraphQLField).join(',\n')
  };
  const returnType = getGraphQLTypeName(name);

  return `
    ${description && '#'} ${description}
    ${query.name}(
      ids: [ID!],
      limit: Int,
      ${query.args}
    ): [${returnType}]

    more_${query.name}(
      cursor: ID
    ): ${returnType}Cursor
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

function getGraphQLField({ name, type, required, isArray }) {
  const fieldName = _.camelCase(name);
  const typeStr = _.capitalize(type).replace('Number', 'Int').replace('Datetime', 'Date');
  const fieldType = (isArray ? `[${typeStr}]` : typeStr).concat(required ? '!' : '');
  return `${fieldName}: ${fieldType}`;
}

function getGraphQLTypeName(modelName) {
  return _.find(models, { name: modelName })._collection;
}
