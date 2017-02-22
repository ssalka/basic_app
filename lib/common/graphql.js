const _ = require('lodash');

const graphQLHelpers = module.exports = {
  getGraphQLField({ name, type, required, isArray }) {
    const fieldName = _.camelCase(name);
    const typeStr = _.capitalize(type).replace('Number', 'Int').replace('Datetime', 'Date');
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
      .thru(field => `$${field}`)
      .value();
  },
  getGraphQLSelectionSet(fields) {
    return _.map(fields, 'name').map(_.camelCase).join('\n');
  }
};
