const _ = require('lodash');

function getGraphQLCollectionType({ name }) {
  return _.startCase(name).replace(/\s/g, '');
}

function getGraphQLField({ name, type, required, isArray }) {
  const fieldName = _.camelCase(name);
  const typeStr = _.capitalize(type).replace('Number', 'Float').replace('Datetime', 'Date');
  const fieldType = (isArray ? `[${typeStr}]` : typeStr);
  return `${fieldName}: ${fieldType}`;
}

function getGraphQLArgument({ name }) {
  const fieldName = _.camelCase(name);
  return `${fieldName}: $${fieldName}`;
}

function getGraphQLVariable(field) {
  return '$' + getGraphQLField(field);
}

function getGraphQLSelectionSet(fields) {
  return _(fields)
    .map('name')
    .map(_.camelCase)
    .unshift('__typename', '_id')
    .join('\n');
}

module.exports = {
  getGraphQLCollectionType,
  getGraphQLField,
  getGraphQLArgument,
  getGraphQLVariable,
  getGraphQLSelectionSet
};
