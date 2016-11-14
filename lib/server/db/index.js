const mongoose = Object.assign(require('mongoose'), { Promise });

const mongoURI = process.env.NODE_ENV === 'production'
  ? '' // TODO set up production db
  : "mongodb://localhost:27017/test";

const conn = require('./connect')(mongoose, mongoURI);

const ModelGen = require('./ModelGen')(conn, mongoose);

module.exports = {
  conn, ModelGen
};
