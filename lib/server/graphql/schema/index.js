const query = require('./query');
const mutation = require('./mutation');
const types = require('./types');

module.exports = `
  ${query}

  ${mutation}

  ${types}
`;
