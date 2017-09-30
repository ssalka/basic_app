const express = require('express');
const {
  findUserByToken,
  loadDocumentsInCollection,
  upsertCollection,
  upsertDocumentInCollection
} = require('./middleware');

module.exports = express.Router()
  .get('/me', findUserByToken)
  .post('/collections/:collectionId', upsertCollection)
  .get('/collections/:collectionId/documents', loadDocumentsInCollection)
  .post('/collections/:collectionId/documents/:documentId', upsertDocumentInCollection);
