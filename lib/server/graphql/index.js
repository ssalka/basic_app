const _ = require('lodash');
const getSchema = require('./schema');
const getResolvers = require('./resolvers');
const { Collection, User } = require('../models');
const { makeExecutableSchema } = require('graphql-tools');

// Load collections on app start to inject into GraphQL
let models = [];
Collection.find().populate({ path: 'creator', model: User }).exec()
  .then(docs => models = docs)
  .catch(console.error);

module.exports = function getGraphQLSchema({
  query, variables: { _id, fields } = {}
}) {
  if (query.includes('updateOrCreateCollection') && _id) {
    // TODO: migrate collection's docs if necessary (eg field name changed)
    const modelIndex = _.findIndex(models, { id: _id });
    modelIndex >= 0 && _.assign(models[modelIndex], { fields });
  }

  const queries = models.map(getGraphQLQuerySignature);
  const typeDefs = models.reduce(modelInjector, getSchema(queries));
  const resolvers = getResolvers(models);
  return makeExecutableSchema({ typeDefs, resolvers });
};

function getGraphQLQuerySignature({ name, fields, creator, _collection }) {
  const query = {
    name: [creator.username, _collection].join('_'),
    args: fields.map(getGraphQLField).join(',\n')
  };
  const returnType = name.replace(/\s/g, '');

  return `
    ${query.name}(
      ids: [ID!],
      limit: Int,
      ${query.args}
    ): [${returnType}]
  `;
}

function modelInjector(schema, model) {
  const type = model.name.replace(/\s/g, '');
  return schema.concat(`
    type ${type} {
      _id: ID!
      ${model.fields.map(getGraphQLField).join('\n')}
    }
  `);
}

function getGraphQLField({ name, type, required, isArray }) {
  const fieldName = _.camelCase(name);
  const typeStr = _.capitalize(type).replace('Number', 'Int').replace('Datetime', 'Date');
  const fieldType = (isArray ? `[${typeStr}]` : typeStr).concat(required ? '!' : '');
  return `${fieldName}: ${fieldType}`;
}
