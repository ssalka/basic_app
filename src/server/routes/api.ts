import * as express from 'express';
import {
  findUserByToken,
  loadDocumentsInCollection,
  upsertCollection,
  upsertDocumentInCollection
} from './middleware';

export default express
  .Router()
  .get('/me', findUserByToken)
  .post('/collections/:collectionId', upsertCollection)
  .get('/collections/:collectionId/documents', loadDocumentsInCollection)
  .post('/collections/:collectionId/documents/:documentId', upsertDocumentInCollection);
