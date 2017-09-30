const _ = require('lodash');
const { FIELD_TYPES } = require('./constants');

module.exports = {
  mapToKeyValueArray(object) {
    return _(object).pickBy().map(
      (val, key) => ({ [key]: val })
    ).value();
  },
  findFieldType(key) {
    return _.find(FIELD_TYPES.STANDARD, { key });
  },
  findDocumentById(collection, _id) {
    return _.find(collection, { _id });
  },
  findCollection(collections, _collection) {
    return _.find(collections, { _collection });
  }
};
