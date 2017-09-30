const express = require('express');
const {
  findUserByToken,
  loadDocumentsInCollection,
  updateDocumentInCollection
} = require('./middleware');

module.exports = express.Router()
  .get('/me', findUserByToken)
  .get('/collections/:collectionId/documents', loadDocumentsInCollection)
  .post('/collections/:collectionId/documents/:documentId/update', updateDocumentInCollection);
