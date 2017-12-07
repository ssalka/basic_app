import * as _ from 'lodash';
import { invoke, invokeMap } from 'lodash/fp';

import { READONLY_FIELDS } from 'lib/common/constants';
import { Collection } from 'lib/server/models';
import { ModelGen } from 'lib/server/utils';

export function loadDocumentsInCollection(req, res, next) {
  const { collectionId } = req.params;
  const { limit = 0 } = req.query;

  Collection.findById(collectionId)
    .then(collection => {
      const Model = ModelGen.getOrGenerateModel(collection);
      const query = Model.find();

      if (limit) {
        query.limit(limit);
      }

      return query.exec();
    })
    .then(invokeMap('toObject'))
    .then(docs => res.json(docs))
    .catch(next);
}

export function upsertDocumentInCollection(req, res, next) {
  const { collectionId, documentId } = req.params;
  const { document: newDocument } = req.body;

  let Model;

  Collection.findById(collectionId)
    .then(collection => {
      Model = ModelGen.getOrGenerateModel(collection);

      return documentId === 'undefined'
        ? Model.create(newDocument)
        : Model.findById(documentId);
    })
    .then(document => {
      if (!document) {
        return Model.create(newDocument);
      }

      // TODO: investigate whether this is still necessary
      // undefined values come out of GraphQL as null
      // don't want to set these on documents
      const denullify = val =>
        _.isArray(val) ? _.reject(val, _.isNull) : _.isNull(val) ? undefined : val;

      // TODO: diffing algorithm
      const updates = _(newDocument)
        .omit(READONLY_FIELDS)
        .mapValues(denullify)
        .value();

      _.assign(document, updates);

      return new Promise((resolve, reject) =>
        document.save((err, doc) => (err ? reject(err) : resolve(doc)))
      );
    })
    .then(invoke('toObject'))
    .then(document => res.json(document))
    .catch(next);
}
