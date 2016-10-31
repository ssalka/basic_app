const mongoose = require('mongoose');

const options = {
  promiseLibrary: require('bluebird')
};

mongoose.Promise = options.promiseLibrary;

const mongoURI = process.env.NODE_ENV === 'production'
  ? '' // TODO set up production db
  : "mongodb://localhost:27017/test";

const db = mongoose.createConnection(mongoURI, options);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected to db');
});

module.exports = db;
