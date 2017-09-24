const mongoose = Object.assign(require('mongoose'), { Promise });
const async = require('async');
const _ = require('lodash');

const systemDbName = process.env.NODE_ENV
  .replace('production', 'appname')
  .replace('development', 'dev');

const collectionsDbName = `${systemDbName}_collections`;

// TODO set up production db
const appMongoURI = `mongodb://localhost:27017/${systemDbName}`;
const collectionsMongoURI = `mongodb://localhost:27017/${collectionsDbName}`;

const connections = {
  app: mongoose.createConnection(appMongoURI),
  collections: mongoose.createConnection(collectionsMongoURI)
};

_.forEach(connections, (conn, name) => {
  conn.on('open', () => console.log(`connected to db ${name}`));
  conn.on('error', err => console.error('connection error:', err));
});

module.exports = {
  connections,
  systemDbName,
  collectionsDbName,
  waitForConnection: cb => new Promise(
    resolve => async.until(
      () => !!connections[systemDbName] && !!connections[collectionsDbName],
      setImmediate,
      cb || resolve
    )
  ),
  closeConnection: cb => mongoose.disconnect(cb)
};
