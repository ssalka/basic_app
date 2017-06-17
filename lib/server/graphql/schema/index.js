const getQuery = require('./query');
const getMutation = require('./mutation');
const getTypes = require('./types');

module.exports = (queries, mutations, models) => `
  ${getQuery(queries)}

  ${getMutation(mutations)}

  ${getTypes(models)}
`;
