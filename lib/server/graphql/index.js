const _ = require('lodash');
const { FIELD_TYPES } = require('lib/common/constants');
const schema = require('./schema');
const resolvers = require('./resolvers');
const { makeExecutableSchema } = require('graphql-tools');

module.exports = function getGraphQLSchema(Models = []) {
  const typeDefs = Models.reduce(modelInjector, schema);
  return makeExecutableSchema({ typeDefs, resolvers });
};


function modelInjector(schema, model) {
  const type = model.name.replace(/\s/g, '');
  return schema.concat(`
    type ${type} {
      ${model.fields.map(getGraphQLField).join('')}
    }
  `);
}

function getGraphQLField({ name, type, required, isArray }) {
  const fieldName = _.camelCase(name);
  const typeStr =  _.capitalize(type).replace('Number', 'Int');
  const fieldType = (isArray ? `[${typeStr}]` : typeStr).concat(required ? '!' : '');
  return `${fieldName}: ${fieldType}\n`;
}
