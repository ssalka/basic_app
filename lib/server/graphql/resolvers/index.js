const Query = require('./query');
const Mutation = require('./mutation');
const typeResolvers = require('./types');

module.exports = Object.assign(typeResolvers, {
  Query,
  Mutation
});
