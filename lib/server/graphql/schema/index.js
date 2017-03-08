const getQuery = require('./query');
const getMutation = require('./mutation');
const types = require('./types');

module.exports = (queries, mutations) => `
  ${getQuery(queries)}

  ${getMutation(mutations)}

  ${types}
`;
