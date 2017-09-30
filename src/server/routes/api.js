const express = require('express');
const {
  findUserByToken,
  loadDocumentsInCollection
} = require('./middleware');

module.exports = express.Router()
  .get('/me', findUserByToken)
  .get('/collections/:_id/documents', loadDocumentsInCollection);
