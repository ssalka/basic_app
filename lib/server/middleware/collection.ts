import * as _ from 'lodash';
import { invoke } from 'lodash/fp';

import { collectionsDbName } from 'lib/server/db';
import { Collection } from 'lib/server/models';

export function upsertCollection(req, res, next) {
  const { collectionId } = req.params;
  const collection = req.body;
  const creator = req.user._id;

  if (collectionId !== 'undefined') {
    // collection already exists
    return Collection.upsert(collection)
      .then(invoke('toObject'))
      .then(coll => res.json(coll))
      .catch(next);
  }

  // TODO: confirm this no longer chappens in absence of GraphQL
  delete collection._id; // defaults to null - mongoose doesn't like that :(
  _.defaults(collection, {
    creator,
    _db: collectionsDbName,
    _collection: `${req.user.username}_${collection.name}`
      .toLowerCase()
      .replace(/\s/g, '')
  });

  const view = {
    name: collection.name,
    type: 'TABLE',
    creator
  };

  Collection.createWithView(collection, view)
    .then(invoke('toObject'))
    .then(coll => res.json(coll))
    .catch(next);
}
