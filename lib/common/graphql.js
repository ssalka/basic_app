const _ = require('lodash');

const graphQLHelpers = module.exports = {
  getGraphQLCollectionType({ name }) {
    return _.startCase(name).replace(/\s/g, '');
  },
  getGraphQLField({ name, type, _collection, required, isArray }) {
    const fieldName = _.camelCase(name);
    const typeStr = type
      ? _.capitalize(type).replace('Number', 'Float').replace('Datetime', 'Date')
      : _collection.split('_').slice(1).join('_');
    const fieldType = (isArray ? `[${typeStr}]` : typeStr);
    return `${fieldName}: ${fieldType}`;
  },
  getGraphQLArgument({ name }) {
    const fieldName = _.camelCase(name);
    return `${fieldName}: $${fieldName}`;
  },
  getGraphQLVariable(field) {
    return _(field)
      .thru(graphQLHelpers.getGraphQLField)
      .thru(field => '$' + field)
      .value();
  },
  getGraphQLSelectionSet(fields) {
    return _(fields)
      .map('name')
      .map(_.camelCase)
      .unshift('__typename', '_id')
      .join('\n');
  }
};
