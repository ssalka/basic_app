const _ = require('lodash');

module.exports = {
  getGraphQLField({ name, type, required, isArray }) {
    const fieldName = _.camelCase(name);
    const typeStr = _.capitalize(type).replace('Number', 'Int').replace('Datetime', 'Date');
    const fieldType = (isArray ? `[${typeStr}]` : typeStr).concat(required ? '!' : '');
    return `${fieldName}: ${fieldType}`;
  },
  getGraphQLArgument({ name }) {
    const fieldName = _.camelCase(name);
    return `${fieldName}: $${fieldName}`;
  }
};
