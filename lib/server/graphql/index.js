const _ = require('lodash');
const getSchema = require('./schema');
const getResolvers = require('./resolvers');
const { makeExecutableSchema } = require('graphql-tools');

module.exports = function getGraphQLSchema(models = []) {
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
  const typeStr = _.capitalize(type).replace('Number', 'Int');
  const fieldType = (isArray ? `[${typeStr}]` : typeStr).concat(required ? '!' : '');
  return `${fieldName}: ${fieldType}`;
}
