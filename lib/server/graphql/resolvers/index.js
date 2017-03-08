const getQueries = require('./query');
const getMutation = require('./mutation');
const typeResolvers = require('./types');

module.exports = function getResolvers(collections) {
  return Object.assign(typeResolvers, {
    Query: getQueries(collections),
    Mutation: getMutation(collections)
  });
};
