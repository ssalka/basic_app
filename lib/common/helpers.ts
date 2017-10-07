import * as _ from 'lodash';
import { FIELD_TYPES } from './constants';

export function mapToKeyValueArray(object) {
  return _(object).pickBy().map(
    (val, key) => ({ [key]: val })
  ).value();
}

export function findFieldType(key) {
  return _.find(FIELD_TYPES.STANDARD, { key });
}

export function findDocumentById(collection, _id) {
  return _.find(collection, { _id });
}

export function findCollection(collections, _collection) {
  return _.find(collections, { _collection });
}
