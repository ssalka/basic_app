const mongoose = Object.assign(require('mongoose'), { Promise });
const async = require('async');

const dbName = process.env.NODE_ENV
  .replace('production', 'appname')
  .replace('development', 'dev');

// TODO set up production db
const mongoURI = `mongodb://localhost:27017/${dbName}`;

const connection = mongoose.createConnection(mongoURI);
connection.once('open', () => console.log('connected to db'));
connection.on('error', err => console.error('connection error:', err));

module.exports = {
  connection,
  dbName,
  waitForConnection: new Promise(
    resolve => async.until(
      () => connection._hasOpened,
      setImmediate, resolve
    )
  )
};
