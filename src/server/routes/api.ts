import * as express from 'express';
import * as middleware from 'lib/server/middleware';

export default express
  .Router()
  .get('/me', middleware.user.findUserByToken)
  .post('/collections/:collectionId', middleware.collection.upsertCollection)
  .get(
    '/collections/:collectionId/documents',
    middleware.document.loadDocumentsInCollection
  )
  .post(
    '/collections/:collectionId/documents/:documentId',
    middleware.document.upsertDocumentInCollection
  )
  .get('/entities', middleware.entity.getEntities)
  .post('/entities', middleware.entity.createEntity)
  .post('/entities/:entityId', middleware.entity.renameEntity);
